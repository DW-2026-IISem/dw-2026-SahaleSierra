import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { Patient, PatientPayload } from '../../../core/models/patient.model';
import { PatientList } from './patient-list';

const BASE = `${environment.apiUrl}/patients`;

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

const NEW_PATIENT: PatientPayload = {
  document_type: 'CC',
  document_number: '52123456',
  name: 'María Pérez',
  birth_date: '1985-03-02',
  contact: '3001112233',
  status: 'active',
};

describe('PatientList', () => {
  let http: HttpTestingController;
  let confirmation: ConfirmationService;
  let messages: MessageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientList],
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
  async function createList(rows: Patient[] = PATIENTS) {
    const fixture = TestBed.createComponent(PatientList);
    http.expectOne(BASE).flush({ patients: rows });
    fixture.detectChanges();
    await fixture.whenStable();
    return { fixture, list: fixture.componentInstance, compiled: fixture.nativeElement as HTMLElement };
  }

  /** Espía que ejecuta `accept()` o `reject()` de inmediato. `confirm` devuelve el servicio. */
  function answerConfirmation(accept: boolean): void {
    vi.spyOn(confirmation, 'confirm').mockImplementation((options) => {
      if (accept) {
        options.accept?.();
      } else {
        options.reject?.();
      }
      return confirmation;
    });
  }

  it('should load the active patients on start', async () => {
    const { list } = await createList();

    expect(list.rows()).toEqual(PATIENTS);
    expect(list.loading()).toBe(false);
    expect(list.error()).toBeNull();
  });

  it('should show the backend error and an empty table when the load fails', async () => {
    const fixture = TestBed.createComponent(PatientList);
    http
      .expectOne(BASE)
      .flush({ error: 'Missing Bearer token' }, { status: 401, statusText: 'Unauthorized' });
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.error()).toBe('Missing Bearer token');
    expect(fixture.componentInstance.rows()).toEqual([]);
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Missing Bearer token');
  });

  it('should filter locally without calling the backend again', async () => {
    const { fixture, list } = await createList();

    list.filter.set('carlos');
    fixture.detectChanges();

    expect(list.visibleRows().map((p) => p.id)).toEqual([2]);
    http.expectNone(BASE);
  });

  it('should render one table row per patient', async () => {
    const { compiled } = await createList();

    // Si la tabla usara `pTemplate` en lugar de `#body`, saldría vacía sin error.
    expect(compiled.querySelectorAll('tbody tr').length).toBe(PATIENTS.length);
    expect(compiled.textContent).toContain('Laura Gómez');
  });

  it('should POST the new patient and reload the list', async () => {
    const { list } = await createList();

    list.openCreate();
    list.save(NEW_PATIENT);

    const creation = http.expectOne(BASE);
    expect(creation.request.method).toBe('POST');
    expect(creation.request.body).toEqual(NEW_PATIENT);
    creation.flush({ patient: { id: 3, ...NEW_PATIENT } });

    expect(list.dialogVisible()).toBe(false);
    http.expectOne(BASE).flush({ patients: [...PATIENTS, { id: 3, ...NEW_PATIENT }] });
    expect(list.rows().length).toBe(3);
  });

  it('should keep the dialog open and show a readable message on a duplicate document', async () => {
    const { list } = await createList();
    const add = vi.spyOn(messages, 'add');

    list.openCreate();
    list.save(NEW_PATIENT);
    http.expectOne(BASE).flush(
      {
        error: 'Internal server error',
        detail: 'SequelizeUniqueConstraintError: Validation error',
      },
      { status: 500, statusText: 'Internal Server Error' },
    );

    expect(list.dialogVisible()).toBe(true);
    expect(list.saving()).toBe(false);
    expect(add).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: 'error',
        summary: 'No se pudo guardar',
        detail: expect.stringContaining('Ya existe un registro'),
      }),
    );
  });

  it('should PATCH the edited patient and send no status', async () => {
    const { list } = await createList();
    const { status: _status, ...edited } = NEW_PATIENT;

    list.openEdit(PATIENTS[0]);
    list.save(edited);

    const change = http.expectOne(`${BASE}/1`);
    expect(change.request.method).toBe('PATCH');
    expect(change.request.body).toEqual(edited);
    expect('status' in change.request.body).toBe(false);
    change.flush({ patient: PATIENTS[0] });

    http.expectOne(BASE).flush({ patients: PATIENTS }); // recarga posterior
  });

  it('should call deactivate after the confirmation is accepted', async () => {
    const { list } = await createList();
    answerConfirmation(true);

    list.deactivate(PATIENTS[0]);

    const deactivation = http.expectOne(`${BASE}/1/deactivate`);
    expect(deactivation.request.method).toBe('PATCH');
    deactivation.flush({ message: 'Patient deactivated (logical delete)' });
    http.expectOne(BASE).flush({ patients: PATIENTS.slice(1) });

    expect(list.rows().map((p) => p.id)).toEqual([2]);
  });

  it('should call DELETE after the confirmation is accepted', async () => {
    const { list } = await createList();
    answerConfirmation(true);

    list.remove(PATIENTS[1]);

    const deletion = http.expectOne(`${BASE}/2`);
    expect(deletion.request.method).toBe('DELETE');
    deletion.flush({ message: 'Patient permanently deleted', id: 2 });
    http.expectOne(BASE).flush({ patients: PATIENTS.slice(0, 1) });

    expect(list.rows().length).toBe(1);
  });

  it('should not call the backend when the confirmation is rejected', async () => {
    const { list } = await createList();
    answerConfirmation(false);

    list.deactivate(PATIENTS[0]);
    list.remove(PATIENTS[0]);

    http.expectNone(`${BASE}/1/deactivate`);
    http.expectNone(`${BASE}/1`);
  });
});
