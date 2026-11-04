import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from '../../../../../environments/environment';
import { Role } from '../../../../core/models/role.model';
import { SessionStore } from '../../../../core/services/session-store';
import { RoleList } from './role-list';

const BASE = `${environment.apiUrl}/roles`;

const ROLES: Role[] = [
  { id: 1, name: 'ADMIN', description: 'Acceso total', status: 'active' },
  { id: 2, name: 'MEDICO', description: 'Atención clínica', status: 'active' },
];

const PERMS = [
  'GET /api/roles',
  'POST /api/roles',
  'PATCH /api/roles/:id',
  'PATCH /api/roles/:id/deactivate',
  'DELETE /api/roles/:id',
].map((key, i) => {
  const [method, path] = key.split(' ');
  return { resource_id: i + 1, method: method as 'GET' | 'POST' | 'PATCH' | 'DELETE', path, description: null, role_id: 1, role_name: 'ADMIN' };
});

describe('RoleList', () => {
  let http: HttpTestingController;
  let confirmation: ConfirmationService;

  beforeEach(async () => {
    localStorage.clear();
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [RoleList],
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
      permissions: PERMS,
    });
  });

  afterEach(() => localStorage.clear());

  async function createList(rows: Role[] = ROLES) {
    const fixture = TestBed.createComponent(RoleList);
    http.expectOne(BASE).flush({ roles: rows });
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

  it('should load roles', async () => {
    const { list } = await createList();
    expect(list.rows().length).toBe(2);
  });

  it('should show the backend error when the load fails', async () => {
    const fixture = TestBed.createComponent(RoleList);
    http.expectOne(BASE).flush({ error: 'Forbidden' }, { status: 403, statusText: 'Forbidden' });
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.componentInstance.error()).toBe('Forbidden');
    expect(fixture.componentInstance.rows()).toEqual([]);
  });

  it('should filter by name or description', async () => {
    const { fixture, list } = await createList();
    list.filter.set('clínica');
    fixture.detectChanges();
    expect(list.visibleRows().map((r) => r.id)).toEqual([2]);
    http.expectNone(BASE);
  });

  it('should POST the new role and reload', async () => {
    const { list } = await createList();
    list.openCreate();
    list.save({ name: 'AUDITOR', description: null });
    const req = http.expectOne(BASE);
    expect(req.request.method).toBe('POST');
    req.flush({ role: { id: 3, name: 'AUDITOR', description: null, status: 'active' } });
    http.expectOne(BASE).flush({ roles: [...ROLES, { id: 3, name: 'AUDITOR', description: null, status: 'active' }] });
  });

  it('should PATCH when editing', async () => {
    const { list } = await createList();
    list.openEdit(ROLES[0]);
    list.save({ name: 'ADMIN', description: 'Nuevo' });
    const req = http.expectOne(`${BASE}/1`);
    expect(req.request.method).toBe('PATCH');
    req.flush({ role: ROLES[0] });
    http.expectOne(BASE).flush({ roles: ROLES });
  });

  it('should deactivate and reload', async () => {
    const { list } = await createList();
    acceptConfirmation();
    list.deactivate(ROLES[0]);
    const req = http.expectOne(`${BASE}/1/deactivate`);
    expect(req.request.method).toBe('PATCH');
    req.flush({ message: 'Role deactivated' });
    http.expectOne(BASE).flush({ roles: ROLES.slice(1) });
  });

  it('should remove and reload', async () => {
    const { list } = await createList();
    acceptConfirmation();
    list.remove(ROLES[1]);
    const req = http.expectOne(`${BASE}/2`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'Role deleted' });
    http.expectOne(BASE).flush({ roles: ROLES.slice(0, 1) });
  });

  it('should not call the backend when the confirmation is rejected', async () => {
    const { list } = await createList();
    vi.spyOn(confirmation, 'confirm').mockImplementation((options) => {
      options.reject?.();
      return confirmation;
    });
    list.deactivate(ROLES[0]);
    http.expectNone(`${BASE}/1/deactivate`);
  });
});
