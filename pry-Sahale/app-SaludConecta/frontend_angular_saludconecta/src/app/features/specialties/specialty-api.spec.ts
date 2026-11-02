import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { Specialty } from '../../core/models/specialty.model';
import { SpecialtyApi } from './specialty-api';

const BASE = `${environment.apiUrl}/specialties`;

const SPECIALTY: Specialty = {
  id: 1,
  name: 'Pediatría',
  description: 'Atención de niños y adolescentes',
  status: 'active',
};

describe('SpecialtyApi', () => {
  let api: SpecialtyApi;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    api = TestBed.inject(SpecialtyApi);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should unwrap { specialties } into Specialty[]', () => {
    let result: Specialty[] | undefined;
    api.list().subscribe((rows) => (result = rows));

    const request = http.expectOne(BASE);
    expect(request.request.method).toBe('GET');
    request.flush({ specialties: [SPECIALTY] });

    expect(result).toEqual([SPECIALTY]);
  });

  it('should unwrap { specialty } when getting one by id', () => {
    let result: Specialty | undefined;
    api.get(1).subscribe((row) => (result = row));

    http.expectOne(`${BASE}/1`).flush({ specialty: SPECIALTY });

    expect(result).toEqual(SPECIALTY);
  });

  it('should POST the payload and unwrap the created specialty', () => {
    let result: Specialty | undefined;
    api.create({ name: 'Pediatría', description: null, status: 'active' }).subscribe(
      (row) => (result = row),
    );

    const request = http.expectOne(BASE);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ name: 'Pediatría', description: null, status: 'active' });
    request.flush({ specialty: SPECIALTY });

    expect(result).toEqual(SPECIALTY);
  });

  it('should PATCH only the sent fields when updating', () => {
    api.update(1, { name: 'Pediatría general' }).subscribe();

    const request = http.expectOne(`${BASE}/1`);
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual({ name: 'Pediatría general' });
    request.flush({ specialty: { ...SPECIALTY, name: 'Pediatría general' } });
  });

  it('should deactivate with PATCH /:id/deactivate', () => {
    api.deactivate(1).subscribe();

    const request = http.expectOne(`${BASE}/1/deactivate`);
    expect(request.request.method).toBe('PATCH');
    request.flush({ message: 'Specialty deactivated (logical delete)', specialty: SPECIALTY });
  });

  it('should delete with DELETE /:id', () => {
    api.remove(1).subscribe();

    const request = http.expectOne(`${BASE}/1`);
    expect(request.request.method).toBe('DELETE');
    request.flush({ message: 'Specialty permanently deleted', id: 1 });
  });
});
