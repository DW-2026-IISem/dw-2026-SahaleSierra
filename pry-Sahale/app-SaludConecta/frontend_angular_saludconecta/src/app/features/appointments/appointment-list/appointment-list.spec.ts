import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { Agenda } from '../../../core/models/agenda.model';
import { Appointment } from '../../../core/models/appointment.model';
import { Doctor } from '../../../core/models/doctor.model';
import { Patient } from '../../../core/models/patient.model';
import { SessionStore } from '../../../core/services/session-store';
import { AppointmentList } from './appointment-list';

const APPOINTMENTS_URL = `${environment.apiUrl}/appointments`;
const AGENDAS_URL = `${environment.apiUrl}/agendas`;
const DOCTORS_URL = `${environment.apiUrl}/doctors`;
const PATIENTS_URL = `${environment.apiUrl}/patients`;

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

const DOCTORS: Doctor[] = [
  { id: 1, name: 'Dra. Laura Ríos', description: 'Pediatra', status: 'active' },
];

const AGENDAS: Agenda[] = [
  { id: 1, name: 'Agenda pediatría mañana', description: null, doctor_id: 1, status: 'active' },
];

const APPOINTMENTS: Appointment[] = [
  {
    id: 1,
    agenda_id: 1,
    patient_id: 1,
    start_date: '2026-11-10T14:00:00.000Z',
    end_date: '2026-11-10T14:30:00.000Z',
    reason: 'Control de rutina',
    state: 'scheduled',
    status: 'active',
  },
  {
    id: 2,
    agenda_id: 1,
    patient_id: 2,
    start_date: '2026-11-11T15:00:00.000Z',
    end_date: '2026-11-11T15:30:00.000Z',
    reason: null,
    state: 'attended',
    status: 'active',
  },
  {
    id: 3,
    agenda_id: 1,
    patient_id: 1,
    start_date: '2026-11-12T16:00:00.000Z',
    end_date: '2026-11-12T16:30:00.000Z',
    reason: 'Vacunación',
    state: 'cancelled',
    status: 'active',
  },
];

describe('AppointmentList', () => {
  let http: HttpTestingController;
  let confirmation: ConfirmationService;
  let messages: MessageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentList],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        MessageService,
        ConfirmationService,
      ],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);

    // Sesión completa: la prueba verifica comportamiento (disabled por estado),
    // no autorización. La autorización está cubierta por _rbac-buttons.spec.ts.
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
        { resource_id: 1, method: 'GET', path: '/api/appointments', description: null, role_id: 1, role_name: 'TEST' },
        { resource_id: 2, method: 'POST', path: '/api/appointments', description: null, role_id: 1, role_name: 'TEST' },
        { resource_id: 3, method: 'PATCH', path: '/api/appointments/:id', description: null, role_id: 1, role_name: 'TEST' },
        { resource_id: 4, method: 'PATCH', path: '/api/appointments/:id/deactivate', description: null, role_id: 1, role_name: 'TEST' },
        { resource_id: 5, method: 'DELETE', path: '/api/appointments/:id', description: null, role_id: 1, role_name: 'TEST' },
      ],
    });

    confirmation = TestBed.inject(ConfirmationService);
    messages = TestBed.inject(MessageService);
  });

  afterEach(() => http.verify());

  /** Responde las cuatro peticiones en paralelo de `load()`. */
  function flushLoad(appointments: Appointment[] = APPOINTMENTS): void {
    http.expectOne(AGENDAS_URL).flush({ agendas: AGENDAS });
    http.expectOne(DOCTORS_URL).flush({ doctors: DOCTORS });
    http.expectOne(PATIENTS_URL).flush({ patients: PATIENTS });
    http.expectOne(APPOINTMENTS_URL).flush({ appointments });
  }

  async function createList() {
    const fixture = TestBed.createComponent(AppointmentList);
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

  it('should load appointments, agendas, doctors and patients in parallel', async () => {
    const { list } = await createList();

    expect(list.rows()).toEqual(APPOINTMENTS);
    expect(list.agendas()).toEqual(AGENDAS);
    expect(list.doctors()).toEqual(DOCTORS);
    expect(list.patients()).toEqual(PATIENTS);
    expect(list.loading()).toBe(false);
    expect(list.error()).toBeNull();
  });

  it('should show the backend error and clear every list when the load fails', async () => {
    const fixture = TestBed.createComponent(AppointmentList);
    http.expectOne(AGENDAS_URL).flush({ agendas: AGENDAS });
    http.expectOne(DOCTORS_URL).flush({ doctors: DOCTORS });
    http.expectOne(PATIENTS_URL).flush({ patients: PATIENTS });
    http
      .expectOne(APPOINTMENTS_URL)
      .flush({ error: 'Missing Bearer token' }, { status: 401, statusText: 'Unauthorized' });
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.error()).toBe('Missing Bearer token');
    expect(fixture.componentInstance.rows()).toEqual([]);
    expect(fixture.componentInstance.patients()).toEqual([]);
  });

  it('should filter by state locally without calling the backend again', async () => {
    const { fixture, list } = await createList();

    list.stateFilter.set('attended');
    fixture.detectChanges();

    expect(list.visibleRows().map((a) => a.id)).toEqual([2]);
    http.expectNone(APPOINTMENTS_URL);
  });

  it('should filter by the patient name', async () => {
    const { fixture, list } = await createList();

    list.filter.set('ruiz');
    fixture.detectChanges();

    expect(list.visibleRows().map((a) => a.id)).toEqual([2]);
  });

  it('should render one table row per appointment with the patient and agenda names', async () => {
    const { compiled } = await createList();

    // Si la tabla usara `pTemplate` en lugar de `#body`, saldría vacía sin error.
    expect(compiled.querySelectorAll('tbody tr').length).toBe(APPOINTMENTS.length);
    expect(compiled.textContent).toContain('Carlos Ruiz');
    expect(compiled.textContent).toContain('Agenda pediatría mañana · Dra. Laura Ríos');
  });

  it('should POST the new appointment without state and reload the lists', async () => {
    const { list } = await createList();
    const payload = {
      agenda_id: 1,
      patient_id: 2,
      start_date: '2026-11-13T14:00:00.000Z',
      end_date: '2026-11-13T14:30:00.000Z',
      reason: null,
      status: 'active' as const,
    };

    list.openCreate();
    list.create(payload);

    const creation = http.expectOne(APPOINTMENTS_URL);
    expect(creation.request.method).toBe('POST');
    expect(creation.request.body).toEqual(payload);
    expect('state' in creation.request.body).toBe(false);
    creation.flush({ appointment: { id: 4, ...payload, state: 'scheduled' } });

    expect(list.dialogVisible()).toBe(false);
    flushLoad();
  });

  it('should keep the dialog open and show a readable message on a schedule overlap', async () => {
    const { list } = await createList();
    const add = vi.spyOn(messages, 'add');

    list.openCreate();
    list.create({
      agenda_id: 1,
      patient_id: 2,
      start_date: '2026-11-10T14:10:00.000Z',
      end_date: '2026-11-10T14:40:00.000Z',
      reason: null,
      status: 'active',
    });
    http.expectOne(APPOINTMENTS_URL).flush(
      { error: 'Agenda already has an appointment in that time range (id 1)' },
      { status: 400, statusText: 'Bad Request' },
    );

    expect(list.dialogVisible()).toBe(true);
    expect(list.saving()).toBe(false);
    expect(add).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: 'error',
        summary: 'No se pudo guardar',
        detail: expect.stringContaining('ya tiene una cita en ese horario'),
      }),
    );
  });

  it('should PATCH only the changed fields when editing', async () => {
    const { list } = await createList();

    list.openEdit(APPOINTMENTS[0]);
    list.update({ reason: 'Control prioritario' });

    const change = http.expectOne(`${APPOINTMENTS_URL}/1`);
    expect(change.request.method).toBe('PATCH');
    expect(change.request.body).toEqual({ reason: 'Control prioritario' });
    change.flush({ appointment: { ...APPOINTMENTS[0], reason: 'Control prioritario' } });

    flushLoad();
  });

  it('should close the dialog and send nothing when the form reports no changes', async () => {
    const { list } = await createList();
    const add = vi.spyOn(messages, 'add');

    list.openEdit(APPOINTMENTS[0]);
    list.onUnchanged();

    expect(list.dialogVisible()).toBe(false);
    expect(add).toHaveBeenCalledWith(expect.objectContaining({ severity: 'info' }));
    http.expectNone(`${APPOINTMENTS_URL}/1`);
  });

  it('should cancel with PATCH { state: "cancelled" } after the confirmation is accepted', async () => {
    const { list } = await createList();
    acceptConfirmation();

    list.cancelAppointment(APPOINTMENTS[0]);

    const cancellation = http.expectOne(`${APPOINTMENTS_URL}/1`);
    expect(cancellation.request.method).toBe('PATCH');
    expect(cancellation.request.body).toEqual({ state: 'cancelled' });
    cancellation.flush({ appointment: { ...APPOINTMENTS[0], state: 'cancelled' } });

    flushLoad();
  });

  it('should allow editing and cancelling only the scheduled appointments', async () => {
    const { list, compiled } = await createList();

    expect(list.canChange(APPOINTMENTS[0])).toBe(true);
    expect(list.canChange(APPOINTMENTS[1])).toBe(false);
    expect(list.canChange(APPOINTMENTS[2])).toBe(false);

    const cancelButtons = Array.from(
      compiled.querySelectorAll('button[aria-label="Cancelar cita"]'),
    ) as HTMLButtonElement[];
    expect(cancelButtons.length).toBe(3);
    expect(cancelButtons.filter((button) => button.disabled).length).toBe(2);
  });

  it('should call deactivate after the confirmation is accepted', async () => {
    const { list } = await createList();
    acceptConfirmation();

    list.deactivate(APPOINTMENTS[0]);

    const deactivation = http.expectOne(`${APPOINTMENTS_URL}/1/deactivate`);
    expect(deactivation.request.method).toBe('PATCH');
    deactivation.flush({ message: 'Appointment deactivated (logical delete)' });
    flushLoad(APPOINTMENTS.slice(1));

    expect(list.rows().map((a) => a.id)).toEqual([2, 3]);
  });

  it('should call DELETE after the confirmation is accepted', async () => {
    const { list } = await createList();
    acceptConfirmation();

    list.remove(APPOINTMENTS[2]);

    const deletion = http.expectOne(`${APPOINTMENTS_URL}/3`);
    expect(deletion.request.method).toBe('DELETE');
    deletion.flush({ message: 'Appointment permanently deleted', id: 3 });
    flushLoad(APPOINTMENTS.slice(0, 2));

    expect(list.rows().length).toBe(2);
  });
});
