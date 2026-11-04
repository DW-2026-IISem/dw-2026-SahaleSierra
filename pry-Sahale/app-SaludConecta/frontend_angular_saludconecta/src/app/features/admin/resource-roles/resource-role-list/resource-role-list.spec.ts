import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from '../../../../../environments/environment';
import { Resource } from '../../../../core/models/resource.model';
import { ResourceRole } from '../../../../core/models/resource-role.model';
import { Role } from '../../../../core/models/role.model';
import { SessionStore } from '../../../../core/services/session-store';
import { ResourceRoleList } from './resource-role-list';

const BASE = `${environment.apiUrl}/resource-roles`;
const ROLES_BASE = `${environment.apiUrl}/roles`;
const RES_BASE = `${environment.apiUrl}/resources`;

const ROLES: Role[] = [
  { id: 1, name: 'ADMIN', description: null, status: 'active' },
  { id: 2, name: 'MEDICO', description: null, status: 'active' },
];
const RESOURCES: Resource[] = [
  { id: 1, method: 'GET', path: '/api/patients', description: null, status: 'active' },
  { id: 2, method: 'POST', path: '/api/patients', description: null, status: 'active' },
];
const GRANTS: ResourceRole[] = [
  { id: 1, role_id: 1, resource_id: 1, status: 'active' },
];

describe('ResourceRoleList', () => {
  let http: HttpTestingController;
  let confirmation: ConfirmationService;

  beforeEach(async () => {
    localStorage.clear();
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [ResourceRoleList],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        MessageService,
        ConfirmationService,
      ],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
    confirmation = TestBed.inject(ConfirmationService);
    const store = TestBed.inject(SessionStore);
    store.setTokens({ access_token: 'A', token_type: 'Bearer', expires_in: 900, refresh_token: 'R', refresh_expires_in: 604800 });
    store.setAccess({
      user: { id: 1, username: 'admin', email: 'a@b', avatar: null, status: 'active' },
      permissions: [
        { resource_id: 1, method: 'GET', path: '/api/resource-roles', description: null, role_id: 1, role_name: 'ADMIN' },
        { resource_id: 2, method: 'POST', path: '/api/resource-roles', description: null, role_id: 1, role_name: 'ADMIN' },
        { resource_id: 3, method: 'PATCH', path: '/api/resource-roles/:id/deactivate', description: null, role_id: 1, role_name: 'ADMIN' },
      ],
    });
  });

  afterEach(() => localStorage.clear());

  function flushLoad(grants = GRANTS) {
    http.expectOne(ROLES_BASE).flush({ roles: ROLES });
    http.expectOne(RES_BASE).flush({ resources: RESOURCES });
    http.expectOne((r) => r.url === BASE && !r.params.has('role_id') && !r.params.has('resource_id')).flush({ grants });
  }

  async function createList() {
    const fixture = TestBed.createComponent(ResourceRoleList);
    flushLoad();
    await fixture.whenStable();
    fixture.detectChanges();
    return { fixture, list: fixture.componentInstance };
  }

  function acceptConfirmation(): void {
    vi.spyOn(confirmation, 'confirm').mockImplementation((options) => {
      options.accept?.();
      return confirmation;
    });
  }

  it('should load grants with roles and resources', async () => {
    const { list } = await createList();
    expect(list.rows().length).toBe(1);
    expect(list.roles().length).toBe(2);
    expect(list.resources().length).toBe(2);
  });

  it('should show backend error when load fails', async () => {
    const fixture = TestBed.createComponent(ResourceRoleList);
    http.expectOne(ROLES_BASE).flush({ roles: [] });
    http.expectOne(RES_BASE).flush({ resources: [] });
    http.expectOne((r) => r.url === BASE).flush({ error: 'Forbidden' }, { status: 403, statusText: 'Forbidden' });
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.componentInstance.error()).toBe('Forbidden');
    expect(fixture.componentInstance.rows()).toEqual([]);
  });

  it('should send role_id as HttpParams when filtering', async () => {
    const { list } = await createList();
    list.filterRoleId.set(2);
    list.onFilterChange();
    http.expectOne(ROLES_BASE).flush({ roles: ROLES });
    http.expectOne(RES_BASE).flush({ resources: RESOURCES });
    const req = http.expectOne((r) => r.url === BASE && r.params.get('role_id') === '2');
    req.flush({ grants: [] });
    expect(list.rows()).toEqual([]);
  });

  it('should send resource_id as HttpParams when filtering', async () => {
    const { list } = await createList();
    list.filterResourceId.set(2);
    list.onFilterChange();
    http.expectOne(ROLES_BASE).flush({ roles: ROLES });
    http.expectOne(RES_BASE).flush({ resources: RESOURCES });
    const req = http.expectOne((r) => r.url === BASE && r.params.get('resource_id') === '2');
    req.flush({ grants: [] });
  });

  it('should create a grant and reload', async () => {
    const { list } = await createList();
    list.openCreate();
    list.selectedRoleId.set(2);
    list.selectedResourceId.set(1);
    list.save();
    const req = http.expectOne(BASE);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ role_id: 2, resource_id: 1 });
    req.flush({ grant: { id: 2, role_id: 2, resource_id: 1, status: 'active' } });
    flushLoad([...GRANTS, { id: 2, role_id: 2, resource_id: 1, status: 'active' }]);
  });

  it('should show toast on creation failure', async () => {
    const messages = TestBed.inject(MessageService);
    const add = vi.spyOn(messages, 'add');
    const { list } = await createList();
    list.openCreate();
    list.selectedRoleId.set(2);
    list.selectedResourceId.set(1);
    list.save();
    http.expectOne(BASE).flush({ error: 'Already exists' }, { status: 400, statusText: 'Bad Request' });
    expect(add).toHaveBeenCalledWith(
      expect.objectContaining({ severity: 'error', summary: 'No se pudo conceder el permiso' }),
    );
  });

  it('should deactivate and reload after confirmation', async () => {
    const { list } = await createList();
    acceptConfirmation();
    list.revocar(GRANTS[0]);
    const req = http.expectOne(`${BASE}/1/deactivate`);
    expect(req.request.method).toBe('PATCH');
    req.flush({ message: 'Grant deactivated' });
    flushLoad([]);
  });

  it('should not call the backend when the confirmation is rejected', async () => {
    const { list } = await createList();
    vi.spyOn(confirmation, 'confirm').mockImplementation((options) => {
      options.reject?.();
      return confirmation;
    });
    list.revocar(GRANTS[0]);
    http.expectNone(`${BASE}/1/deactivate`);
  });

  it('should map method to severity', async () => {
    const { list } = await createList();
    expect(list.severityFor('GET')).toBe('info');
    expect(list.severityFor('POST')).toBe('success');
    expect(list.severityFor('DELETE')).toBe('danger');
  });
});
