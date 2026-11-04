import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../../environments/environment';
import { Role } from '../../../core/models/role.model';
import { RoleApi } from './role-api';

const BASE = `${environment.apiUrl}/roles`;

const ROLE: Role = { id: 1, name: 'ADMIN', description: 'Acceso total', status: 'active' };

describe('RoleApi', () => {
  let api: RoleApi;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    api = TestBed.inject(RoleApi);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should unwrap { roles } into Role[]', () => {
    let result: Role[] | undefined;
    api.list().subscribe((rows) => (result = rows));

    http.expectOne(BASE).flush({ roles: [ROLE] });

    expect(result).toEqual([ROLE]);
  });

  it('should unwrap { role } when getting one by id', () => {
    let result: Role | undefined;
    api.get(1).subscribe((row) => (result = row));

    http.expectOne(`${BASE}/1`).flush({ role: ROLE });

    expect(result).toEqual(ROLE);
  });

  it('should POST the payload and unwrap the created role', () => {
    const payload = { name: 'ADMIN', description: 'Acceso total', status: 'active' as const };
    let result: Role | undefined;
    api.create(payload).subscribe((row) => (result = row));

    const request = http.expectOne(BASE);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(payload);
    request.flush({ role: ROLE });

    expect(result).toEqual(ROLE);
  });

  it('should PATCH only the sent fields when updating', () => {
    api.update(1, { description: 'Acceso completo' }).subscribe();

    const request = http.expectOne(`${BASE}/1`);
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual({ description: 'Acceso completo' });
    expect('status' in request.request.body).toBe(false);
    request.flush({ role: ROLE });
  });

  it('should PUT the full payload when replacing', () => {
    const payload = { name: 'ADMIN', description: 'Acceso total del sistema' };
    api.replace(1, payload).subscribe();

    const request = http.expectOne(`${BASE}/1`);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(payload);
    request.flush({ role: ROLE });
  });

  it('should deactivate with PATCH /:id/deactivate', () => {
    api.deactivate(1).subscribe();

    const request = http.expectOne(`${BASE}/1/deactivate`);
    expect(request.request.method).toBe('PATCH');
    request.flush({ message: 'Role deactivated' });
  });
});
