import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { Agenda } from '../../../core/models/agenda.model';
import { Doctor } from '../../../core/models/doctor.model';
import { AgendaList } from './agenda-list';

const AGENDAS_URL = `${environment.apiUrl}/agendas`;
const DOCTORS_URL = `${environment.apiUrl}/doctors`;

const DOCTORS: Doctor[] = [
  { id: 1, name: 'Dra. Camila Torres', description: null, status: 'active' },
  { id: 2, name: 'Dr. Andrés Ramírez', description: null, status: 'active' },
];

const AGENDAS: Agenda[] = [
  {
    id: 1,
    name: 'Consulta externa · mañana',
    description: 'Lunes a viernes, 7:00 a 12:00',
    doctor_id: 1,
    status: 'active',
  },
  {
    id: 2,
    name: 'Cardiología · tarde',
    description: 'Martes y jueves, 14:00 a 18:00',
    doctor_id: 2,
    status: 'active',
  },
];

describe('AgendaList', () => {
  let http: HttpTestingController;
  let confirmation: ConfirmationService;
  let messages: MessageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgendaList],
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

  /** Responde los dos `GET` que lanza `load()`. */
  function flushLoad(agendas: Agenda[] = AGENDAS, doctors: Doctor[] = DOCTORS): void {
    http.expectOne(AGENDAS_URL).flush({ agendas });
    http.expectOne(DOCTORS_URL).flush({ doctors });
  }

  /** Crea la pantalla y responde la carga inicial. */
  async function createList(agendas: Agenda[] = AGENDAS) {
    const fixture = TestBed.createComponent(AgendaList);
    flushLoad(agendas);
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

  it('should load the agendas and the active doctors in parallel on start', async () => {
    const { list } = await createList();

    expect(list.rows()).toEqual(AGENDAS);
    expect(list.doctors()).toEqual(DOCTORS);
    expect(list.loading()).toBe(false);
    expect(list.error()).toBeNull();
  });

  it('should resolve the doctor name and fall back to the id when the doctor is not active', async () => {
    const { list } = await createList();

    expect(list.doctorName()(1)).toBe('Dra. Camila Torres');
    expect(list.doctorName()(9)).toBe('Médico #9');
  });

  it('should show the backend error and an empty table when a load fails', async () => {
    const fixture = TestBed.createComponent(AgendaList);
    http
      .expectOne(AGENDAS_URL)
      .flush({ error: 'Missing Bearer token' }, { status: 401, statusText: 'Unauthorized' });
    // forkJoin cancela la otra petición al fallar la primera.
    http.expectOne(DOCTORS_URL);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.error()).toBe('Missing Bearer token');
    expect(fixture.componentInstance.rows()).toEqual([]);
    expect(fixture.componentInstance.loading()).toBe(false);
  });

  it('should filter by doctor name locally without calling the backend again', async () => {
    const { fixture, list } = await createList();

    list.filter.set('andrés');
    fixture.detectChanges();

    expect(list.visibleRows().map((row) => row.id)).toEqual([2]);
    http.expectNone(AGENDAS_URL);
  });

  it('should render one table row per agenda with the doctor name', async () => {
    const { compiled } = await createList();

    // Si la tabla usara `pTemplate` en lugar de `#body`, saldría vacía sin error.
    expect(compiled.querySelectorAll('tbody tr').length).toBe(AGENDAS.length);
    expect(compiled.textContent).toContain('Cardiología · tarde');
    expect(compiled.textContent).toContain('Dr. Andrés Ramírez');
  });

  it('should POST the new agenda with its doctor_id and reload', async () => {
    const { list } = await createList();
    const payload = {
      name: 'Procedimientos',
      description: null,
      doctor_id: 2,
      status: 'active' as const,
    };

    list.openCreate();
    list.save(payload);

    const creation = http.expectOne(AGENDAS_URL);
    expect(creation.request.method).toBe('POST');
    expect(creation.request.body).toEqual(payload);
    creation.flush({ agenda: { id: 3, ...payload } });

    expect(list.dialogVisible()).toBe(false);
    flushLoad([...AGENDAS, { id: 3, ...payload }]);
    expect(list.rows().length).toBe(3);
  });

  it('should PATCH the edited agenda and send no status', async () => {
    const { list } = await createList();
    const payload = {
      name: 'Consulta externa · mañana',
      description: 'Lunes a viernes, 7:00 a 13:00',
      doctor_id: 2,
    };

    list.openEdit(AGENDAS[0]);
    list.save(payload);

    const change = http.expectOne(`${AGENDAS_URL}/1`);
    expect(change.request.method).toBe('PATCH');
    expect(change.request.body).toEqual(payload);
    expect('status' in change.request.body).toBe(false);
    change.flush({ agenda: { ...AGENDAS[0], ...payload } });

    flushLoad(); // recarga posterior
  });

  it('should call deactivate after the confirmation is accepted and reload', async () => {
    const { list } = await createList();
    acceptConfirmation();

    list.deactivate(AGENDAS[0]);

    const deactivation = http.expectOne(`${AGENDAS_URL}/1/deactivate`);
    expect(deactivation.request.method).toBe('PATCH');
    deactivation.flush({ message: 'Agenda deactivated (logical delete)' });
    flushLoad(AGENDAS.slice(1));

    expect(list.rows().map((row) => row.id)).toEqual([2]);
  });

  it('should call DELETE after the confirmation is accepted and reload', async () => {
    const { list } = await createList();
    acceptConfirmation();

    list.remove(AGENDAS[1]);

    const deletion = http.expectOne(`${AGENDAS_URL}/2`);
    expect(deletion.request.method).toBe('DELETE');
    deletion.flush({ message: 'Agenda permanently deleted', id: 2 });
    flushLoad(AGENDAS.slice(0, 1));

    expect(list.rows().length).toBe(1);
  });

  it('should explain that the logical delete is preferable when DELETE fails by related appointments', async () => {
    const { list } = await createList();
    const add = vi.spyOn(messages, 'add');
    acceptConfirmation();

    list.remove(AGENDAS[0]);
    http.expectOne(`${AGENDAS_URL}/1`).flush(
      {
        error: 'Internal server error',
        detail: 'SequelizeForeignKeyConstraintError: Cannot delete or update a parent row',
      },
      { status: 500, statusText: 'Internal Server Error' },
    );

    expect(add).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: 'error',
        summary: 'No se pudo eliminar',
        detail: expect.stringContaining('baja lógica'),
      }),
    );
    // No se recarga: la agenda sigue en la tabla.
    expect(list.rows().length).toBe(2);
  });
});
