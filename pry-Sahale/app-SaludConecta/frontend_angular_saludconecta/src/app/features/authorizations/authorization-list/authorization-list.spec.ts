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
import { Authorization } from '../../../core/models/authorization.model';
import { Patient } from '../../../core/models/patient.model';
import { AuthorizationList } from './authorization-list';

const AUTHORIZATIONS_URL = `${environment.apiUrl}/authorizations`;
const APPOINTMENTS_URL = `${environment.apiUrl}/appointments`;
const PATIENTS_URL = `${environment.apiUrl}/patients`;
const AGENDAS_URL = `${environment.apiUrl}/agendas`;

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
    reason: null,
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
    state: 'scheduled',
    status: 'active',
  },
  {
    id: 3,
    agenda_id: 1,
    patient_id: 1,
    start_date: '2026-11-12T16:00:00.000Z',
    end_date: '2026-11-12T16:30:00.000Z',
    reason: null,
    state: 'scheduled',
    status: 'active',
  },
];

const AUTHORIZATIONS: Authorization[] = [
  {
    id: 1,
    name: 'AUT-00012345',
    description: 'Autorización EPS Sura',
    appointment_id: 1,
    status: 'active',
  },
];

describe('AuthorizationList', () => {
  let http: HttpTestingController;
  let confirmation: ConfirmationService;
  let messages: MessageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorizationList],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        MessageService,
        ConfirmationService,
      ],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    confirmation = TestBed.inject(ConfirmationService);
    messages = TestBed.inject(MessageService);
  });

  afterEach(() => http.verify());

  /** Responde las cuatro peticiones en paralelo de `load()`. */
  function flushLoad(authorizations: Authorization[] = AUTHORIZATIONS): void {
    http.expectOne(APPOINTMENTS_URL).flush({ appointments: APPOINTMENTS });
    http.expectOne(PATIENTS_URL).flush({ patients: PATIENTS });
    http.expectOne(AGENDAS_URL).flush({ agendas: AGENDAS });
    http.expectOne(AUTHORIZATIONS_URL).flush({ authorizations });
  }

  async function createList() {
    const fixture = TestBed.createComponent(AuthorizationList);
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

  it('should load authorizations, appointments, patients and agendas in parallel', async () => {
    const { list } = await createList();

    expect(list.rows()).toEqual(AUTHORIZATIONS);
    expect(list.appointments()).toEqual(APPOINTMENTS);
    expect(list.patients()).toEqual(PATIENTS);
    expect(list.agendas()).toEqual(AGENDAS);
    expect(list.loading()).toBe(false);
    expect(list.error()).toBeNull();
  });

  it('should show the backend error and clear every list when the load fails', async () => {
    const fixture = TestBed.createComponent(AuthorizationList);
    http.expectOne(APPOINTMENTS_URL).flush({ appointments: APPOINTMENTS });
    http.expectOne(PATIENTS_URL).flush({ patients: PATIENTS });
    http.expectOne(AGENDAS_URL).flush({ agendas: AGENDAS });
    http
      .expectOne(AUTHORIZATIONS_URL)
      .flush({ error: 'Missing Bearer token' }, { status: 401, statusText: 'Unauthorized' });
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.error()).toBe('Missing Bearer token');
    expect(fixture.componentInstance.rows()).toEqual([]);
    expect(fixture.componentInstance.appointments()).toEqual([]);
  });

  it('should offer only the appointments without an authorization', async () => {
    const { list } = await createList();

    expect(list.availableAppointments().map((appointment) => appointment.id)).toEqual([2, 3]);
    expect(list.formOptions().map((option) => option.id)).toEqual([2, 3]);
    expect(list.formOptions()[0].label).toContain('Carlos Ruiz');
  });

  it('should filter by the patient of the appointment without calling the backend again', async () => {
    const { fixture, list } = await createList();

    list.filter.set('laura');
    fixture.detectChanges();
    expect(list.visibleRows().map((row) => row.id)).toEqual([1]);

    list.filter.set('ruiz');
    fixture.detectChanges();
    expect(list.visibleRows()).toEqual([]);
    http.expectNone(AUTHORIZATIONS_URL);
  });

  it('should render one table row per authorization with the patient of its appointment', async () => {
    const { compiled } = await createList();

    // Si la tabla usara `pTemplate` en lugar de `#body`, saldría vacía sin error.
    expect(compiled.querySelectorAll('tbody tr').length).toBe(AUTHORIZATIONS.length);
    expect(compiled.textContent).toContain('Laura Gómez');
    expect(compiled.textContent).toContain('AUT-00012345');
  });

  it('should POST the new authorization with a numeric appointment_id and reload the lists', async () => {
    const { list } = await createList();
    const payload = {
      name: 'AUT-00067890',
      description: null,
      appointment_id: 2,
      status: 'active' as const,
    };

    list.openCreate();
    list.create(payload);

    const creation = http.expectOne(AUTHORIZATIONS_URL);
    expect(creation.request.method).toBe('POST');
    expect(creation.request.body).toEqual(payload);
    creation.flush({ authorization: { id: 2, ...payload } });

    expect(list.dialogVisible()).toBe(false);
    flushLoad([...AUTHORIZATIONS, { id: 2, ...payload }]);
    expect(list.availableAppointments().map((appointment) => appointment.id)).toEqual([3]);
  });

  it('should keep the dialog open and show a readable message when the appointment already has one', async () => {
    const { list } = await createList();
    const add = vi.spyOn(messages, 'add');

    list.openCreate();
    list.create({ name: 'AUT-otra', description: null, appointment_id: 1, status: 'active' });
    http.expectOne(AUTHORIZATIONS_URL).flush(
      { error: 'Appointment already has an authorization' },
      { status: 400, statusText: 'Bad Request' },
    );

    expect(list.dialogVisible()).toBe(true);
    expect(list.saving()).toBe(false);
    expect(add).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: 'error',
        summary: 'No se pudo guardar',
        detail: expect.stringContaining('ya tiene una autorización'),
      }),
    );
  });

  it('should PATCH only name and description when editing', async () => {
    const { list } = await createList();
    const payload = { name: 'AUT-00012346', description: 'EPS Sura' };

    list.openEdit(AUTHORIZATIONS[0]);
    list.update(payload);

    const change = http.expectOne(`${AUTHORIZATIONS_URL}/1`);
    expect(change.request.method).toBe('PATCH');
    expect(change.request.body).toEqual(payload);
    expect('appointment_id' in change.request.body).toBe(false);
    expect('status' in change.request.body).toBe(false);
    change.flush({ authorization: { ...AUTHORIZATIONS[0], ...payload } });

    flushLoad(); // recarga posterior
  });

  it('should call deactivate after the confirmation is accepted', async () => {
    const { list } = await createList();
    acceptConfirmation();

    list.deactivate(AUTHORIZATIONS[0]);

    const deactivation = http.expectOne(`${AUTHORIZATIONS_URL}/1/deactivate`);
    expect(deactivation.request.method).toBe('PATCH');
    deactivation.flush({ message: 'Authorization deactivated (logical delete)' });
    flushLoad([]);

    expect(list.rows()).toEqual([]);
  });

  it('should call DELETE after the confirmation is accepted', async () => {
    const { list } = await createList();
    acceptConfirmation();

    list.remove(AUTHORIZATIONS[0]);

    const deletion = http.expectOne(`${AUTHORIZATIONS_URL}/1`);
    expect(deletion.request.method).toBe('DELETE');
    deletion.flush({ message: 'Authorization permanently deleted', id: 1 });
    flushLoad([]);

    expect(list.rows().length).toBe(0);
  });
});
