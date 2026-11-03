import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { ClinicalRecord } from '../../../core/models/clinical-record.model';
import { Patient } from '../../../core/models/patient.model';
import { ClinicalRecordList } from './clinical-record-list';

const RECORDS_URL = `${environment.apiUrl}/clinical-records`;
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
  {
    id: 3,
    document_type: 'CC',
    document_number: '52123456',
    name: 'María Pérez',
    birth_date: '1985-03-02',
    contact: '3001112233',
    status: 'active',
  },
];

const RECORDS: ClinicalRecord[] = [
  { id: 1, name: 'HC-1032456789', description: 'Control anual', patient_id: 1, status: 'active' },
  { id: 2, name: 'HC-1045678123', description: null, patient_id: 2, status: 'active' },
];

describe('ClinicalRecordList', () => {
  let http: HttpTestingController;
  let confirmation: ConfirmationService;
  let messages: MessageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClinicalRecordList],
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

  /** Responde las dos peticiones en paralelo de `load()`. */
  function flushLoad(records: ClinicalRecord[] = RECORDS, patients: Patient[] = PATIENTS): void {
    http.expectOne(PATIENTS_URL).flush({ patients });
    http.expectOne(RECORDS_URL).flush({ clinical_records: records });
  }

  async function createList() {
    const fixture = TestBed.createComponent(ClinicalRecordList);
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

  it('should load the records and the patients in parallel', async () => {
    const { list } = await createList();

    expect(list.rows()).toEqual(RECORDS);
    expect(list.patients()).toEqual(PATIENTS);
    expect(list.loading()).toBe(false);
    expect(list.error()).toBeNull();
  });

  it('should show the backend error and clear both lists when the load fails', async () => {
    const fixture = TestBed.createComponent(ClinicalRecordList);
    http.expectOne(PATIENTS_URL).flush({ patients: PATIENTS });
    http
      .expectOne(RECORDS_URL)
      .flush({ error: 'Missing Bearer token' }, { status: 401, statusText: 'Unauthorized' });
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.error()).toBe('Missing Bearer token');
    expect(fixture.componentInstance.rows()).toEqual([]);
    expect(fixture.componentInstance.patients()).toEqual([]);
  });

  it('should offer only the patients without a clinical record', async () => {
    const { list } = await createList();

    expect(list.availablePatients().map((patient) => patient.id)).toEqual([3]);
    expect(list.formPatients().map((patient) => patient.id)).toEqual([3]);
  });

  it('should filter by the patient name locally without calling the backend again', async () => {
    const { fixture, list } = await createList();

    list.filter.set('ruiz');
    fixture.detectChanges();

    expect(list.visibleRows().map((record) => record.id)).toEqual([2]);
    http.expectNone(RECORDS_URL);
  });

  it('should render one table row per record with the patient name instead of the id', async () => {
    const { compiled } = await createList();

    // Si la tabla usara `pTemplate` en lugar de `#body`, saldría vacía sin error.
    expect(compiled.querySelectorAll('tbody tr').length).toBe(RECORDS.length);
    expect(compiled.textContent).toContain('Carlos Ruiz');
  });

  it('should POST the new record with a numeric patient_id and reload both lists', async () => {
    const { list } = await createList();
    const payload = {
      name: 'HC-52123456',
      description: null,
      patient_id: 3,
      status: 'active' as const,
    };

    list.openCreate();
    list.create(payload);

    const creation = http.expectOne(RECORDS_URL);
    expect(creation.request.method).toBe('POST');
    expect(creation.request.body).toEqual(payload);
    creation.flush({ clinical_record: { id: 3, ...payload } });

    expect(list.dialogVisible()).toBe(false);
    flushLoad([...RECORDS, { id: 3, ...payload }], PATIENTS);
    expect(list.rows().length).toBe(3);
    expect(list.availablePatients()).toEqual([]);
  });

  it('should keep the dialog open and show a readable message when the patient already has a record', async () => {
    const { list } = await createList();
    const add = vi.spyOn(messages, 'add');

    list.openCreate();
    list.create({ name: 'HC-otra', description: null, patient_id: 1, status: 'active' });
    http.expectOne(RECORDS_URL).flush(
      { error: 'Patient already has a clinical record (id 5, status inactive)' },
      { status: 400, statusText: 'Bad Request' },
    );

    expect(list.dialogVisible()).toBe(true);
    expect(list.saving()).toBe(false);
    expect(add).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: 'error',
        summary: 'No se pudo guardar',
        detail: expect.stringContaining('ya tiene una historia clínica'),
      }),
    );
  });

  it('should PATCH only name and description when editing', async () => {
    const { list } = await createList();
    const payload = { name: 'HC-1032456789-A', description: 'Control anual y vacunas' };

    list.openEdit(RECORDS[0]);
    list.update(payload);

    const change = http.expectOne(`${RECORDS_URL}/1`);
    expect(change.request.method).toBe('PATCH');
    expect(change.request.body).toEqual(payload);
    expect('patient_id' in change.request.body).toBe(false);
    expect('status' in change.request.body).toBe(false);
    change.flush({ clinical_record: { ...RECORDS[0], ...payload } });

    flushLoad(); // recarga posterior
  });

  it('should call deactivate after the confirmation is accepted', async () => {
    const { list } = await createList();
    acceptConfirmation();

    list.deactivate(RECORDS[0]);

    const deactivation = http.expectOne(`${RECORDS_URL}/1/deactivate`);
    expect(deactivation.request.method).toBe('PATCH');
    deactivation.flush({ message: 'Clinical record deactivated (logical delete)' });
    flushLoad(RECORDS.slice(1));

    expect(list.rows().map((record) => record.id)).toEqual([2]);
  });

  it('should call DELETE after the confirmation is accepted', async () => {
    const { list } = await createList();
    acceptConfirmation();

    list.remove(RECORDS[1]);

    const deletion = http.expectOne(`${RECORDS_URL}/2`);
    expect(deletion.request.method).toBe('DELETE');
    deletion.flush({ message: 'Clinical record permanently deleted', id: 2 });
    flushLoad(RECORDS.slice(0, 1));

    expect(list.rows().length).toBe(1);
  });

  it('should open the record of the patient when the lookup finds it', async () => {
    const { list } = await createList();

    list.lookupPatientId.set(1);
    list.lookup();

    http.expectOne(`${RECORDS_URL}/patient/1`).flush({ clinical_record: RECORDS[0] });

    expect(list.editing()).toEqual(RECORDS[0]);
    expect(list.dialogVisible()).toBe(true);
    expect(list.lookingUp()).toBe(false);
  });

  it('should offer to create the record when the lookup answers 404', async () => {
    const { list } = await createList();
    const add = vi.spyOn(messages, 'add');

    list.lookupPatientId.set(3);
    list.lookup();

    http.expectOne(`${RECORDS_URL}/patient/3`).flush(
      { error: 'Clinical record not found for this patient' },
      { status: 404, statusText: 'Not Found' },
    );

    expect(list.editing()).toBeNull();
    expect(list.dialogVisible()).toBe(true);
    expect(list.presetPatientId()).toBe(3);
    expect(add).toHaveBeenCalledWith(expect.objectContaining({ severity: 'info' }));
  });
});
