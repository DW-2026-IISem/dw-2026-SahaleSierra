import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { Appointment } from '../../../core/models/appointment.model';
import { ClinicalRecord } from '../../../core/models/clinical-record.model';
import { Encounter } from '../../../core/models/encounter.model';
import { Patient } from '../../../core/models/patient.model';
import { Service } from '../../../core/models/service.model';
import { SessionStore } from '../../../core/services/session-store';
import { EncounterList } from './encounter-list';

const ENCOUNTERS_URL = `${environment.apiUrl}/encounters`;
const APPOINTMENTS_URL = `${environment.apiUrl}/appointments`;
const PATIENTS_URL = `${environment.apiUrl}/patients`;
const SERVICES_URL = `${environment.apiUrl}/services`;
const RECORDS_URL = `${environment.apiUrl}/clinical-records`;

const PATIENTS: Patient[] = [
  {
    id: 1,
    document_type: 'CC',
    document_number: '1032456789',
    name: 'Laura Gómez',
    birth_date: '1990-05-12',
    contact: '3104567890',
    status: 'active',
  },
  {
    id: 2,
    document_type: 'CC',
    document_number: '1045678123',
    name: 'Carlos Ruiz',
    birth_date: '1979-11-30',
    contact: '3112223344',
    status: 'active',
  },
];

const SERVICES: Service[] = [
  { id: 1, name: 'Consulta de medicina general', description: null, status: 'active' },
  { id: 2, name: 'Electrocardiograma', description: null, status: 'active' },
];

/** Citas 1-3 atendidas; 4 y 5 programadas. */
const appointment = (
  id: number,
  patientId: number,
  state: Appointment['state'],
): Appointment => ({
  id,
  agenda_id: 1,
  patient_id: patientId,
  start_date: `2026-11-1${id}T14:00:00.000Z`,
  end_date: `2026-11-1${id}T14:30:00.000Z`,
  reason: null,
  state,
  status: 'active',
});

const APPOINTMENTS: Appointment[] = [
  appointment(1, 1, 'attended'),
  appointment(2, 2, 'attended'),
  appointment(3, 1, 'attended'),
  appointment(4, 1, 'scheduled'),
  appointment(5, 2, 'scheduled'),
];

/** Solo Laura (paciente 1) tiene historia clínica activa. */
const RECORDS: ClinicalRecord[] = [
  { id: 1, name: 'HC-1032456789', description: null, patient_id: 1, status: 'active' },
];

const encounter = (overrides: Partial<Encounter>): Encounter => ({
  id: 1,
  appointment_id: 1,
  clinical_record_id: 1,
  service_id: 1,
  start_date: '2026-11-11T14:00:00.000Z',
  end_date: '2026-11-11T14:30:00.000Z',
  total: '85000.00',
  state: 'completed',
  observations: null,
  invoice_id: null,
  status: 'active',
  ...overrides,
});

const ENCOUNTERS: Encounter[] = [
  encounter({ id: 1, appointment_id: 1 }),
  encounter({ id: 2, appointment_id: 2, service_id: 2, total: '120000.00', state: 'in_progress' }),
  encounter({ id: 3, appointment_id: 3, invoice_id: 9 }),
];

describe('EncounterList', () => {
  let http: HttpTestingController;
  let confirmation: ConfirmationService;
  let messages: MessageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EncounterList],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        MessageService,
        ConfirmationService,
      ],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);

    // Sesión completa: la prueba verifica `disabled` por factura, no autorización.
    const store = TestBed.inject(SessionStore);
    store.setTokens({
      access_token: 'A',
      token_type: 'Bearer',
      expires_in: 900,
      refresh_token: 'R',
      refresh_expires_in: 604800,
    });
    store.setAccess({
      user: { id: 1, username: 'test', email: 't@b', avatar: null, status: 'active' },
      permissions: [
        { resource_id: 1, method: 'GET', path: '/api/encounters', description: null, role_id: 1, role_name: 'TEST' },
        { resource_id: 2, method: 'POST', path: '/api/encounters', description: null, role_id: 1, role_name: 'TEST' },
        { resource_id: 3, method: 'PATCH', path: '/api/encounters/:id', description: null, role_id: 1, role_name: 'TEST' },
        { resource_id: 4, method: 'PATCH', path: '/api/encounters/:id/deactivate', description: null, role_id: 1, role_name: 'TEST' },
        { resource_id: 5, method: 'DELETE', path: '/api/encounters/:id', description: null, role_id: 1, role_name: 'TEST' },
      ],
    });

    confirmation = TestBed.inject(ConfirmationService);
    messages = TestBed.inject(MessageService);
  });

  afterEach(() => http.verify());

  /** Responde las cinco peticiones en paralelo de `load()`. */
  function flushLoad(encounters: Encounter[] = ENCOUNTERS): void {
    http.expectOne(APPOINTMENTS_URL).flush({ appointments: APPOINTMENTS });
    http.expectOne(PATIENTS_URL).flush({ patients: PATIENTS });
    http.expectOne(SERVICES_URL).flush({ services: SERVICES });
    http.expectOne(RECORDS_URL).flush({ clinical_records: RECORDS });
    http.expectOne(ENCOUNTERS_URL).flush({ encounters });
  }

  async function createList() {
    const fixture = TestBed.createComponent(EncounterList);
    flushLoad();
    fixture.detectChanges();
    await fixture.whenStable();
    return {
      fixture,
      list: fixture.componentInstance,
      compiled: fixture.nativeElement as HTMLElement,
    };
  }

  /** Espía que acepta la confirmación de inmediato. `confirm` devuelve el servicio. */
  function acceptConfirmation(): void {
    vi.spyOn(confirmation, 'confirm').mockImplementation((options) => {
      options.accept?.();
      return confirmation;
    });
  }

  it('should load encounters, appointments, patients, services and records in parallel', async () => {
    const { list } = await createList();

    expect(list.rows()).toEqual(ENCOUNTERS);
    expect(list.appointments()).toEqual(APPOINTMENTS);
    expect(list.patients()).toEqual(PATIENTS);
    expect(list.services()).toEqual(SERVICES);
    expect(list.clinicalRecords()).toEqual(RECORDS);
    expect(list.loading()).toBe(false);
    expect(list.error()).toBeNull();
  });

  it('should show the backend error and clear every list when the load fails', async () => {
    const fixture = TestBed.createComponent(EncounterList);
    http.expectOne(APPOINTMENTS_URL).flush({ appointments: APPOINTMENTS });
    http.expectOne(PATIENTS_URL).flush({ patients: PATIENTS });
    http.expectOne(SERVICES_URL).flush({ services: SERVICES });
    http.expectOne(RECORDS_URL).flush({ clinical_records: RECORDS });
    http
      .expectOne(ENCOUNTERS_URL)
      .flush({ error: 'Missing Bearer token' }, { status: 401, statusText: 'Unauthorized' });
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.error()).toBe('Missing Bearer token');
    expect(fixture.componentInstance.rows()).toEqual([]);
    expect(fixture.componentInstance.clinicalRecords()).toEqual([]);
  });

  it('should offer only the scheduled appointments and flag the patients without a clinical record', async () => {
    const { list } = await createList();

    expect(list.appointmentOptions().map((option) => option.id)).toEqual([4, 5]);
    expect(list.appointmentOptions().map((option) => option.hasRecord)).toEqual([true, false]);
    expect(list.appointmentOptions()[0].label).toContain('Laura Gómez');
  });

  it('should filter by the patient name locally without calling the backend again', async () => {
    const { fixture, list } = await createList();

    list.filter.set('carlos');
    fixture.detectChanges();

    expect(list.visibleRows().map((row) => row.id)).toEqual([2]);
    http.expectNone(ENCOUNTERS_URL);
  });

  it('should render one table row per encounter with patient, service and invoice', async () => {
    const { compiled } = await createList();

    // Si la tabla usara `pTemplate` en lugar de `#body`, saldría vacía sin error.
    expect(compiled.querySelectorAll('tbody tr').length).toBe(ENCOUNTERS.length);
    expect(compiled.textContent).toContain('Carlos Ruiz');
    expect(compiled.textContent).toContain('Electrocardiograma');
    expect(compiled.textContent).toContain('Factura #9');
    expect(compiled.textContent).toContain('Sin facturar');
  });

  it('should POST the encounter, announce that the appointment is now attended and reload', async () => {
    const { list } = await createList();
    const add = vi.spyOn(messages, 'add');
    const payload = {
      appointment_id: 4,
      service_id: 1,
      total: 85000,
      state: 'completed' as const,
      status: 'active' as const,
    };

    list.openCreate();
    list.create(payload);

    const creation = http.expectOne(ENCOUNTERS_URL);
    expect(creation.request.method).toBe('POST');
    expect(creation.request.body).toEqual(payload);
    creation.flush({
      encounter: encounter({ id: 4, appointment_id: 4 }),
      appointment: { ...APPOINTMENTS[3], state: 'attended' },
    });

    expect(list.dialogVisible()).toBe(false);
    expect(add).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: 'success',
        summary: 'Atención registrada',
        detail: expect.stringContaining('«Atendida»'),
      }),
    );
    flushLoad();
  });

  it('should keep the dialog open and explain the missing clinical record', async () => {
    const { list } = await createList();
    const add = vi.spyOn(messages, 'add');

    list.openCreate();
    list.create({ appointment_id: 5, service_id: 1, state: 'completed', status: 'active' });
    http.expectOne(ENCOUNTERS_URL).flush(
      { error: 'Patient must have an active clinical record' },
      { status: 400, statusText: 'Bad Request' },
    );

    expect(list.dialogVisible()).toBe(true);
    expect(list.saving()).toBe(false);
    expect(add).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: 'error',
        summary: 'No se pudo guardar',
        detail: expect.stringContaining('historia clínica activa'),
      }),
    );
  });

  it('should PATCH only the changed fields when editing', async () => {
    const { list } = await createList();

    list.openEdit(ENCOUNTERS[0]);
    list.update({ observations: 'Control en 15 días' });

    const change = http.expectOne(`${ENCOUNTERS_URL}/1`);
    expect(change.request.method).toBe('PATCH');
    expect(change.request.body).toEqual({ observations: 'Control en 15 días' });
    change.flush({ encounter: { ...ENCOUNTERS[0], observations: 'Control en 15 días' } });

    flushLoad();
  });

  it('should close the dialog and send nothing when the form reports no changes', async () => {
    const { list } = await createList();
    const add = vi.spyOn(messages, 'add');

    list.openEdit(ENCOUNTERS[0]);
    list.onUnchanged();

    expect(list.dialogVisible()).toBe(false);
    expect(add).toHaveBeenCalledWith(expect.objectContaining({ severity: 'info' }));
    http.expectNone(`${ENCOUNTERS_URL}/1`);
  });

  it('should complete an in-progress encounter with PATCH { state: "completed" }', async () => {
    const { list } = await createList();

    expect(list.canComplete(ENCOUNTERS[1])).toBe(true);
    expect(list.canComplete(ENCOUNTERS[0])).toBe(false);

    list.complete(ENCOUNTERS[1]);

    const completion = http.expectOne(`${ENCOUNTERS_URL}/2`);
    expect(completion.request.method).toBe('PATCH');
    expect(completion.request.body).toEqual({ state: 'completed' });
    completion.flush({ encounter: { ...ENCOUNTERS[1], state: 'completed' } });

    flushLoad();
  });

  it('should not allow deleting a billed encounter', async () => {
    const { list, compiled } = await createList();

    expect(list.canRemove(ENCOUNTERS[0])).toBe(true);
    expect(list.canRemove(ENCOUNTERS[2])).toBe(false);

    const deleteButtons = Array.from(
      compiled.querySelectorAll('button[aria-label="Eliminar atención"]'),
    ) as HTMLButtonElement[];
    expect(deleteButtons.length).toBe(3);
    expect(deleteButtons.filter((button) => button.disabled).length).toBe(1);
  });

  it('should call deactivate after the confirmation is accepted', async () => {
    const { list } = await createList();
    acceptConfirmation();

    list.deactivate(ENCOUNTERS[0]);

    const deactivation = http.expectOne(`${ENCOUNTERS_URL}/1/deactivate`);
    expect(deactivation.request.method).toBe('PATCH');
    deactivation.flush({ message: 'Encounter deactivated (logical delete)' });
    flushLoad(ENCOUNTERS.slice(1));

    expect(list.rows().map((row) => row.id)).toEqual([2, 3]);
  });

  it('should call DELETE after the confirmation is accepted', async () => {
    const { list } = await createList();
    acceptConfirmation();

    list.remove(ENCOUNTERS[0]);

    const deletion = http.expectOne(`${ENCOUNTERS_URL}/1`);
    expect(deletion.request.method).toBe('DELETE');
    deletion.flush({ message: 'Encounter permanently deleted', id: 1 });
    flushLoad(ENCOUNTERS.slice(1));

    expect(list.rows().length).toBe(2);
  });
});
