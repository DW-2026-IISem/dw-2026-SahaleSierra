import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { Doctor } from '../../../core/models/doctor.model';
import { DoctorList } from './doctor-list';

const BASE = `${environment.apiUrl}/doctors`;

const DOCTORS: Doctor[] = [
  {
    id: 1,
    name: 'Dra. Camila Torres',
    description: 'Registro médico RM-10234',
    status: 'active',
  },
  {
    id: 2,
    name: 'Dr. Andrés Ramírez',
    description: 'Registro médico RM-20871',
    status: 'active',
  },
];

describe('DoctorList', () => {
  let http: HttpTestingController;
  let confirmation: ConfirmationService;
  let messages: MessageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorList],
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

  /** Crea la pantalla y responde el GET inicial. */
  async function createList(rows: Doctor[] = DOCTORS) {
    const fixture = TestBed.createComponent(DoctorList);
    http.expectOne(BASE).flush({ doctors: rows });
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

  it('should load the active doctors on start', async () => {
    const { list } = await createList();

    expect(list.rows()).toEqual(DOCTORS);
    expect(list.loading()).toBe(false);
    expect(list.error()).toBeNull();
  });

  it('should show the backend error and an empty table when the load fails', async () => {
    const fixture = TestBed.createComponent(DoctorList);
    http
      .expectOne(BASE)
      .flush({ error: 'Missing Bearer token' }, { status: 401, statusText: 'Unauthorized' });
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.error()).toBe('Missing Bearer token');
    expect(fixture.componentInstance.rows()).toEqual([]);
  });

  it('should filter by description locally without calling the backend again', async () => {
    const { fixture, list } = await createList();

    list.filter.set('rm-20871');
    fixture.detectChanges();

    expect(list.visibleRows().map((s) => s.id)).toEqual([2]);
    http.expectNone(BASE);
  });

  it('should render one table row per doctor', async () => {
    const { compiled } = await createList();

    // Si la tabla usara `pTemplate` en lugar de `#body`, saldría vacía sin error.
    expect(compiled.querySelectorAll('tbody tr').length).toBe(DOCTORS.length);
    expect(compiled.textContent).toContain('Dra. Camila Torres');
  });

  it('should POST the new doctor and reload the list', async () => {
    const { list } = await createList();
    const payload = { name: 'Dr. Felipe Mora', description: null, status: 'active' as const };

    list.openCreate();
    list.save(payload);

    const creation = http.expectOne(BASE);
    expect(creation.request.method).toBe('POST');
    expect(creation.request.body).toEqual(payload);
    creation.flush({ doctor: { id: 3, ...payload } });

    expect(list.dialogVisible()).toBe(false);
    http.expectOne(BASE).flush({ doctors: [...DOCTORS, { id: 3, ...payload }] });
    expect(list.rows().length).toBe(3);
  });

  it('should PATCH the edited doctor and send no status', async () => {
    const { list } = await createList();
    const payload = { name: 'Dra. Camila Torres Ruiz', description: 'Registro médico RM-10234 · turno mañana' };

    list.openEdit(DOCTORS[0]);
    list.save(payload);

    const change = http.expectOne(`${BASE}/1`);
    expect(change.request.method).toBe('PATCH');
    expect(change.request.body).toEqual(payload);
    expect('status' in change.request.body).toBe(false);
    change.flush({ doctor: { ...DOCTORS[0], ...payload } });

    http.expectOne(BASE).flush({ doctors: DOCTORS }); // recarga posterior
  });

  it('should call deactivate after the confirmation is accepted', async () => {
    const { list } = await createList();
    acceptConfirmation();

    list.deactivate(DOCTORS[0]);

    const deactivation = http.expectOne(`${BASE}/1/deactivate`);
    expect(deactivation.request.method).toBe('PATCH');
    deactivation.flush({ message: 'Doctor deactivated (logical delete)' });
    http.expectOne(BASE).flush({ doctors: DOCTORS.slice(1) });

    expect(list.rows().map((s) => s.id)).toEqual([2]);
  });

  it('should call DELETE after the confirmation is accepted', async () => {
    const { list } = await createList();
    acceptConfirmation();

    list.remove(DOCTORS[1]);

    const deletion = http.expectOne(`${BASE}/2`);
    expect(deletion.request.method).toBe('DELETE');
    deletion.flush({ message: 'Doctor permanently deleted', id: 2 });
    http.expectOne(BASE).flush({ doctors: DOCTORS.slice(0, 1) });

    expect(list.rows().length).toBe(1);
  });

  it('should explain that the logical delete is preferable when DELETE fails by related data', async () => {
    const { list } = await createList();
    const add = vi.spyOn(messages, 'add');
    acceptConfirmation();

    list.remove(DOCTORS[0]);
    http.expectOne(`${BASE}/1`).flush(
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
    // No se recarga: el médico sigue en la tabla.
    expect(list.rows().length).toBe(2);
  });
});
