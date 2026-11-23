import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../../environments/environment';
import { ResourceRole, RoleGrantReconciliation } from '../../../core/models/resource-role.model';
import { ResourceRoleApi } from './resource-role-api';

const BASE = `${environment.apiUrl}/resource-roles`;

describe('ResourceRoleApi', () => {
  let api: ResourceRoleApi;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    api = TestBed.inject(ResourceRoleApi);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should unwrap { grants } and not { resource_roles }', () => {
    const grant: ResourceRole = { id: 1, resource_id: 1, role_id: 3, status: 'active' };
    let result: ResourceRole[] | undefined;
    api.list().subscribe((rows) => (result = rows));

    http.expectOne(BASE).flush({ grants: [grant] });

    expect(result).toEqual([grant]);
  });

  it('should send role_id and resource_id as query params', () => {
    api.list({ role_id: 3, resource_id: 1 }).subscribe();

    const request = http.expectOne((r) => r.url === BASE);
    expect(request.request.params.get('role_id')).toBe('3');
    expect(request.request.params.get('resource_id')).toBe('1');
    request.flush({ grants: [] });
  });

  it('should reactivate with PATCH /:id/reactivate (no DELETE)', () => {
    api.reactivate(1).subscribe();

    const request = http.expectOne(`${BASE}/1/reactivate`);
    expect(request.request.method).toBe('PATCH');
    request.flush({ message: 'Grant reactivated' });

    http.expectNone(`${BASE}/1`);
  });

  it('should POST { role_id, resource_ids } and unwrap { result }', () => {
    const summary: RoleGrantReconciliation = { role_id: 5, activated: 0, deactivated: 13, total_active: 2 };
    let result: RoleGrantReconciliation | undefined;
    api.reconcileRole(5, [1, 2]).subscribe((value) => (result = value));

    const request = http.expectOne(BASE);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ role_id: 5, resource_ids: [1, 2] });
    request.flush({ message: 'Role permissions updated', result: summary });

    expect(result).toEqual(summary);
  });

  it('should fail when the matrix response has no result', () => {
    let error: unknown;
    api.reconcileRole(5, []).subscribe({ error: (e: unknown) => (error = e) });

    http.expectOne(BASE).flush({ message: 'Role permissions updated' });

    expect(error).toBeInstanceOf(Error);
  });
});

