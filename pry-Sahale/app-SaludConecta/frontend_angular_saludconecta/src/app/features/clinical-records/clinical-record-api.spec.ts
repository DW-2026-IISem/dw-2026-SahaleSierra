import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { ClinicalRecord } from '../../core/models/clinical-record.model';
import { ClinicalRecordApi } from './clinical-record-api';

const BASE = `${environment.apiUrl}/clinical-records`;

const RECORD: ClinicalRecord = {
  id: 1,
  name: 'HC-1032456789',
  description: 'Control anual',
  patient_id: 1,
  status: 'active',
};

describe('ClinicalRecordApi', () => {
  let api: ClinicalRecordApi;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    api = TestBed.inject(ClinicalRecordApi);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should unwrap { clinical_records } into ClinicalRecord[]', () => {
    let result: ClinicalRecord[] | undefined;
    api.list().subscribe((rows) => (result = rows));

    const request = http.expectOne(BASE);
    expect(request.request.method).toBe('GET');
    request.flush({ clinical_records: [RECORD] });

    expect(result).toEqual([RECORD]);
  });

  it('should unwrap { clinical_record } when getting one by id', () => {
    let result: ClinicalRecord | undefined;
    api.get(1).subscribe((row) => (result = row));

    http.expectOne(`${BASE}/1`).flush({ clinical_record: RECORD });

    expect(result).toEqual(RECORD);
  });

  it('should call the extra route /patient/:patientId and unwrap the record', () => {
    let result: ClinicalRecord | undefined;
    api.getByPatient(5).subscribe((row) => (result = row));

    const request = http.expectOne(`${BASE}/patient/5`);
    expect(request.request.method).toBe('GET');
    request.flush({ clinical_record: RECORD });

    expect(result).toEqual(RECORD);
  });

  it('should propagate the 404 of the extra route as an HttpErrorResponse', () => {
    let failure: unknown;
    api.getByPatient(9).subscribe({ error: (error: unknown) => (failure = error) });

    http
      .expectOne(`${BASE}/patient/9`)
      .flush(
        { error: 'Clinical record not found for this patient' },
        { status: 404, statusText: 'Not Found' },
      );

    expect(failure instanceof HttpErrorResponse).toBe(true);
    expect((failure as HttpErrorResponse).status).toBe(404);
  });

  it('should POST the payload and unwrap the created record', () => {
    let result: ClinicalRecord | undefined;
    api
      .create({ name: 'HC-1032456789', patient_id: 1, description: null, status: 'active' })
      .subscribe((row) => (result = row));

    const request = http.expectOne(BASE);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      name: 'HC-1032456789',
      patient_id: 1,
      description: null,
      status: 'active',
    });
    request.flush({ clinical_record: RECORD });

    expect(result).toEqual(RECORD);
  });

  it('should PATCH only name and description when updating', () => {
    api.update(1, { name: 'HC-1032456789-A', description: 'Control anual' }).subscribe();

    const request = http.expectOne(`${BASE}/1`);
    expect(request.request.method).toBe('PATCH');
    expect('patient_id' in request.request.body).toBe(false);
    request.flush({ clinical_record: RECORD });
  });

  it('should deactivate with PATCH /:id/deactivate', () => {
    api.deactivate(1).subscribe();

    const request = http.expectOne(`${BASE}/1/deactivate`);
    expect(request.request.method).toBe('PATCH');
    request.flush({ message: 'Clinical record deactivated (logical delete)' });
  });

  it('should delete with DELETE /:id', () => {
    api.remove(1).subscribe();

    const request = http.expectOne(`${BASE}/1`);
    expect(request.request.method).toBe('DELETE');
    request.flush({ message: 'Clinical record permanently deleted', id: 1 });
  });
});
