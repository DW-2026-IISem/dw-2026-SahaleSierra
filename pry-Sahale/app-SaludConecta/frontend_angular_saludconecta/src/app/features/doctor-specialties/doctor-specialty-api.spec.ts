import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { DoctorSpecialty } from '../../core/models/doctor-specialty.model';
import { DoctorSpecialtyApi } from './doctor-specialty-api';

const BASE = `${environment.apiUrl}/doctor-specialties`;

const LINK: DoctorSpecialty = {
  id: 1,
  doctor_id: 1,
  specialty_id: 2,
  status: 'active',
};

describe('DoctorSpecialtyApi', () => {
  let api: DoctorSpecialtyApi;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    api = TestBed.inject(DoctorSpecialtyApi);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should unwrap { doctor_specialties } into DoctorSpecialty[]', () => {
    let result: DoctorSpecialty[] | undefined;
    api.list().subscribe((rows) => (result = rows));

    const request = http.expectOne(BASE);
    expect(request.request.method).toBe('GET');
    request.flush({ doctor_specialties: [LINK] });

    expect(result).toEqual([LINK]);
  });

  it('should unwrap { doctor_specialty } when getting one by id', () => {
    let result: DoctorSpecialty | undefined;
    api.get(1).subscribe((row) => (result = row));

    http.expectOne(`${BASE}/1`).flush({ doctor_specialty: LINK });

    expect(result).toEqual(LINK);
  });

  it('should POST the pair and unwrap the created link', () => {
    let result: DoctorSpecialty | undefined;
    api.create({ doctor_id: 1, specialty_id: 2 }).subscribe((row) => (result = row));

    const request = http.expectOne(BASE);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ doctor_id: 1, specialty_id: 2 });
    request.flush({ doctor_specialty: LINK });

    expect(result).toEqual(LINK);
  });

  it('should PATCH only the sent fields when updating', () => {
    api.update(1, { specialty_id: 3 }).subscribe();

    const request = http.expectOne(`${BASE}/1`);
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual({ specialty_id: 3 });
    request.flush({ doctor_specialty: { ...LINK, specialty_id: 3 } });
  });

  it('should deactivate with PATCH /:id/deactivate', () => {
    api.deactivate(1).subscribe();

    const request = http.expectOne(`${BASE}/1/deactivate`);
    expect(request.request.method).toBe('PATCH');
    request.flush({ message: 'Doctor specialty deactivated (logical delete)', doctor_specialty: LINK });
  });

  it('should delete with DELETE /:id', () => {
    api.remove(1).subscribe();

    const request = http.expectOne(`${BASE}/1`);
    expect(request.request.method).toBe('DELETE');
    request.flush({ message: 'Doctor specialty permanently deleted', id: 1 });
  });
});
