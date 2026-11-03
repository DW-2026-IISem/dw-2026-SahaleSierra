import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { Authorization } from '../../core/models/authorization.model';
import { AuthorizationApi } from './authorization-api';

const BASE = `${environment.apiUrl}/authorizations`;

const AUTHORIZATION: Authorization = {
  id: 1,
  name: 'AUT-00012345',
  description: 'Autorización EPS Sura',
  appointment_id: 1,
  status: 'active',
};

describe('AuthorizationApi', () => {
  let api: AuthorizationApi;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    api = TestBed.inject(AuthorizationApi);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should unwrap { authorizations } into Authorization[]', () => {
    let result: Authorization[] | undefined;
    api.list().subscribe((rows) => (result = rows));

    const request = http.expectOne(BASE);
    expect(request.request.method).toBe('GET');
    request.flush({ authorizations: [AUTHORIZATION] });

    expect(result).toEqual([AUTHORIZATION]);
  });

  it('should unwrap { authorization } when getting one by id', () => {
    let result: Authorization | undefined;
    api.get(1).subscribe((row) => (result = row));

    http.expectOne(`${BASE}/1`).flush({ authorization: AUTHORIZATION });

    expect(result).toEqual(AUTHORIZATION);
  });

  it('should POST the payload and unwrap the created authorization', () => {
    const payload = {
      name: 'AUT-00012345',
      appointment_id: 1,
      description: null,
      status: 'active' as const,
    };
    let result: Authorization | undefined;
    api.create(payload).subscribe((row) => (result = row));

    const request = http.expectOne(BASE);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(payload);
    request.flush({ authorization: AUTHORIZATION });

    expect(result).toEqual(AUTHORIZATION);
  });

  it('should PATCH only name and description when updating', () => {
    api.update(1, { name: 'AUT-00012346', description: 'EPS Sura' }).subscribe();

    const request = http.expectOne(`${BASE}/1`);
    expect(request.request.method).toBe('PATCH');
    expect('appointment_id' in request.request.body).toBe(false);
    request.flush({ authorization: AUTHORIZATION });
  });

  it('should deactivate with PATCH /:id/deactivate', () => {
    api.deactivate(1).subscribe();

    const request = http.expectOne(`${BASE}/1/deactivate`);
    expect(request.request.method).toBe('PATCH');
    request.flush({ message: 'Authorization deactivated (logical delete)' });
  });

  it('should delete with DELETE /:id', () => {
    api.remove(1).subscribe();

    const request = http.expectOne(`${BASE}/1`);
    expect(request.request.method).toBe('DELETE');
    request.flush({ message: 'Authorization permanently deleted', id: 1 });
  });
});
