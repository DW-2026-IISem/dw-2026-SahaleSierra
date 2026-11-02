import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { Specialty } from '../../../core/models/specialty.model';
import { SpecialtyList } from './specialty-list';

const BASE = `${environment.apiUrl}/specialties`;

const SPECIALTIES: Specialty[] = [
  {
    id: 1,
    name: 'Pediatría',
    description: 'Atención de niños y adolescentes',
    status: 'active',
  },
  {
    id: 2,
    name: 'Cardiología',
    description: 'Corazón y sistema circulatorio',
    status: 'active',
  },
];

describe('SpecialtyList', () => {
  let http: HttpTestingController;
  let confirmation: ConfirmationService;
  let messages: MessageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecialtyList],
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
  async function createList(rows: Specialty[] = SPECIALTIES) {
    const fixture = TestBed.createComponent(SpecialtyList);
    http.expectOne(BASE).flush({ specialties: rows });
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

  it('should load the active specialties on start', async () => {
    const { list } = await createList();

    expect(list.rows()).toEqual(SPECIALTIES);
    expect(list.loading()).toBe(false);
    expect(list.error()).toBeNull();
  });

  it('should show the backend error and an empty table when the load fails', async () => {
    const fixture = TestBed.createComponent(SpecialtyList);
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

    list.filter.set('corazón');
    fixture.detectChanges();

    expect(list.visibleRows().map((s) => s.id)).toEqual([2]);
    http.expectNone(BASE);
  });

  it('should render one table row per specialty', async () => {
    const { compiled } = await createList();

    // Si la tabla usara `pTemplate` en lugar de `#body`, saldría vacía sin error.
    expect(compiled.querySelectorAll('tbody tr').length).toBe(SPECIALTIES.length);
    expect(compiled.textContent).toContain('Pediatría');
  });

  it('should POST the new specialty and reload the list', async () => {
    const { list } = await createList();
    const payload = { name: 'Ortopedia', description: null, status: 'active' as const };

    list.openCreate();
    list.save(payload);

    const creation = http.expectOne(BASE);
    expect(creation.request.method).toBe('POST');
    expect(creation.request.body).toEqual(payload);
    creation.flush({ specialty: { id: 3, ...payload } });

    expect(list.dialogVisible()).toBe(false);
    http.expectOne(BASE).flush({ specialties: [...SPECIALTIES, { id: 3, ...payload }] });
    expect(list.rows().length).toBe(3);
  });

  it('should PATCH the edited specialty and send no status', async () => {
    const { list } = await createList();
    const payload = { name: 'Pediatría general', description: 'Control de crecimiento' };

    list.openEdit(SPECIALTIES[0]);
    list.save(payload);

    const change = http.expectOne(`${BASE}/1`);
    expect(change.request.method).toBe('PATCH');
    expect(change.request.body).toEqual(payload);
    expect('status' in change.request.body).toBe(false);
    change.flush({ specialty: { ...SPECIALTIES[0], ...payload } });

    http.expectOne(BASE).flush({ specialties: SPECIALTIES }); // recarga posterior
  });

  it('should call deactivate after the confirmation is accepted', async () => {
    const { list } = await createList();
    acceptConfirmation();

    list.deactivate(SPECIALTIES[0]);

    const deactivation = http.expectOne(`${BASE}/1/deactivate`);
    expect(deactivation.request.method).toBe('PATCH');
    deactivation.flush({ message: 'Specialty deactivated (logical delete)' });
    http.expectOne(BASE).flush({ specialties: SPECIALTIES.slice(1) });

    expect(list.rows().map((s) => s.id)).toEqual([2]);
  });

  it('should call DELETE after the confirmation is accepted', async () => {
    const { list } = await createList();
    acceptConfirmation();

    list.remove(SPECIALTIES[1]);

    const deletion = http.expectOne(`${BASE}/2`);
    expect(deletion.request.method).toBe('DELETE');
    deletion.flush({ message: 'Specialty permanently deleted', id: 2 });
    http.expectOne(BASE).flush({ specialties: SPECIALTIES.slice(0, 1) });

    expect(list.rows().length).toBe(1);
  });

  it('should explain that the logical delete is preferable when DELETE fails by related data', async () => {
    const { list } = await createList();
    const add = vi.spyOn(messages, 'add');
    acceptConfirmation();

    list.remove(SPECIALTIES[0]);
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
    // No se recarga: la especialidad sigue en la tabla.
    expect(list.rows().length).toBe(2);
  });
});
