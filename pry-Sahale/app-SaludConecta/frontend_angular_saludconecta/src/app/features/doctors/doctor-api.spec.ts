import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { Doctor } from '../../core/models/doctor.model';
import { DoctorApi } from './doctor-api';

const BASE = `${environment.apiUrl}/doctors`;

const DOCTOR: Doctor = {
  id: 1,
  name: 'Dra. Camila Torres',
  description: 'Registro médico RM-10234',
  status: 'active',
};

describe('DoctorApi', () => {
  let api: DoctorApi;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    api = TestBed.inject(DoctorApi);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should unwrap { doctors } into Doctor[]', () => {
    let result: Doctor[] | undefined;
    api.list().subscribe((rows) => (result = rows));

    const request = http.expectOne(BASE);
    expect(request.request.method).toBe('GET');
    request.flush({ doctors: [DOCTOR] });

    expect(result).toEqual([DOCTOR]);
  });

  it('should unwrap { doctor } when getting one by id', () => {
    let result: Doctor | undefined;
    api.get(1).subscribe((row) => (result = row));

    http.expectOne(`${BASE}/1`).flush({ doctor: DOCTOR });

    expect(result).toEqual(DOCTOR);
  });

  it('should POST the payload and unwrap the created doctor', () => {
    let result: Doctor | undefined;
    api.create({ name: 'Dra. Camila Torres', description: null, status: 'active' }).subscribe(
      (row) => (result = row),
    );

    const request = http.expectOne(BASE);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ name: 'Dra. Camila Torres', description: null, status: 'active' });
    request.flush({ doctor: DOCTOR });

    expect(result).toEqual(DOCTOR);
  });

  it('should PATCH only the sent fields when updating', () => {
    api.update(1, { name: 'Dra. Camila Torres Ruiz' }).subscribe();

    const request = http.expectOne(`${BASE}/1`);
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual({ name: 'Dra. Camila Torres Ruiz' });
    request.flush({ doctor: { ...DOCTOR, name: 'Dra. Camila Torres Ruiz' } });
  });

  it('should deactivate with PATCH /:id/deactivate', () => {
    api.deactivate(1).subscribe();

    const request = http.expectOne(`${BASE}/1/deactivate`);
    expect(request.request.method).toBe('PATCH');
    request.flush({ message: 'Doctor deactivated (logical delete)', doctor: DOCTOR });
  });

  it('should delete with DELETE /:id', () => {
    api.remove(1).subscribe();

    const request = http.expectOne(`${BASE}/1`);
    expect(request.request.method).toBe('DELETE');
    request.flush({ message: 'Doctor permanently deleted', id: 1 });
  });
});
