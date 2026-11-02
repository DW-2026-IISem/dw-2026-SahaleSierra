import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { Patient } from '../../core/models/patient.model';
import { PatientApi } from './patient-api';

const BASE = `${environment.apiUrl}/patients`;

const PATIENT: Patient = {
  id: 1,
  document_type: 'CC',
  document_number: '1032456789',
  name: 'Laura Gómez',
  birth_date: '1990-05-12',
  contact: '3104567890',
  status: 'active',
};

describe('PatientApi', () => {
  let api: PatientApi;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    api = TestBed.inject(PatientApi);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should unwrap { patients } into Patient[]', () => {
    let result: Patient[] | undefined;
    api.list().subscribe((patients) => (result = patients));

    const request = http.expectOne(BASE);
    expect(request.request.method).toBe('GET');
    request.flush({ patients: [PATIENT] });

    expect(result).toEqual([PATIENT]);
  });

  it('should build URLs from environment.apiUrl (no trailing slash)', () => {
    expect(environment.apiUrl.endsWith('/api')).toBe(true);
    api.list().subscribe();
    http.expectOne('http://localhost:4000/api/patients').flush({ patients: [] });
  });

  it('should deactivate with PATCH /:id/deactivate', () => {
    api.deactivate(7).subscribe();

    const request = http.expectOne(`${BASE}/7/deactivate`);
    expect(request.request.method).toBe('PATCH');
    request.flush({ message: 'Patient deactivated (logical delete)', patient: PATIENT });
  });
});
