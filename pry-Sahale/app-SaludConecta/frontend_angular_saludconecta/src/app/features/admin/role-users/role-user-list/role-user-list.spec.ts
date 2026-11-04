import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from '../../../../../environments/environment';
import { Role } from '../../../../core/models/role.model';
import { RoleUser } from '../../../../core/models/role-user.model';
import { User } from '../../../../core/models/user.model';
import { SessionStore } from '../../../../core/services/session-store';
import { RoleUserList } from './role-user-list';

const BASE = `${environment.apiUrl}/role-users`;
const USERS_BASE = `${environment.apiUrl}/users`;
const ROLES_BASE = `${environment.apiUrl}/roles`;

const USERS: User[] = [
  { id: 1, username: 'admin', email: 'admin@b', avatar: null, status: 'active' },
  { id: 2, username: 'medico', email: 'medico@b', avatar: null, status: 'active' },
];
const ROLES: Role[] = [
  { id: 1, name: 'ADMIN', description: null, status: 'active' },
  { id: 2, name: 'MEDICO', description: null, status: 'active' },
];
const ASSIGNMENTS: RoleUser[] = [
  { id: 1, user_id: 1, role_id: 1, status: 'active' },
];

describe('RoleUserList', () => {
  let http: HttpTestingController;
  let confirmation: ConfirmationService;

  beforeEach(async () => {
    localStorage.clear();
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [RoleUserList],
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
        { resource_id: 1, method: 'GET', path: '/api/role-users', description: null, role_id: 1, role_name: 'ADMIN' },
        { resource_id: 2, method: 'POST', path: '/api/role-users', description: null, role_id: 1, role_name: 'ADMIN' },
        { resource_id: 3, method: 'PATCH', path: '/api/role-users/:id/deactivate', description: null, role_id: 1, role_name: 'ADMIN' },
      ],
    });
  });

  afterEach(() => localStorage.clear());

  function flushLoad(assignments = ASSIGNMENTS) {
    http.expectOne(USERS_BASE).flush({ users: USERS });
    http.expectOne(ROLES_BASE).flush({ roles: ROLES });
    http.expectOne(BASE).flush({ assignments });
  }

  async function createList() {
    const fixture = TestBed.createComponent(RoleUserList);
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

  it('should load assignments with users and roles', async () => {
    const { list } = await createList();
    expect(list.rows().length).toBe(1);
    expect(list.users().length).toBe(2);
    expect(list.roles().length).toBe(2);
  });

  it('should show backend error when load fails', async () => {
    const fixture = TestBed.createComponent(RoleUserList);
    http.expectOne(USERS_BASE).flush({ users: [] });
    http.expectOne(ROLES_BASE).flush({ roles: [] });
    http.expectOne(BASE).flush({ error: 'Forbidden' }, { status: 403, statusText: 'Forbidden' });
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.componentInstance.error()).toBe('Forbidden');
    expect(fixture.componentInstance.rows()).toEqual([]);
  });

  it('should filter by username or role', async () => {
    const { fixture, list } = await createList();
    list.filter.set('medico');
    fixture.detectChanges();
    expect(list.visibleRows().length).toBe(0);
    list.filter.set('admin');
    fixture.detectChanges();
    expect(list.visibleRows().length).toBe(1);
    http.expectNone(BASE);
  });

  it('should create an assignment and reload', async () => {
    const { list } = await createList();
    list.openCreate();
    list.selectedUserId.set(2);
    list.selectedRoleId.set(2);
    list.save();
    const req = http.expectOne(BASE);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ user_id: 2, role_id: 2 });
    req.flush({ assignment: { id: 2, user_id: 2, role_id: 2, status: 'active' } });
    http.expectOne(USERS_BASE).flush({ users: USERS });
    http.expectOne(ROLES_BASE).flush({ roles: ROLES });
    http.expectOne(BASE).flush({ assignments: [...ASSIGNMENTS, { id: 2, user_id: 2, role_id: 2, status: 'active' }] });
  });

  it('should show toast on creation failure', async () => {
    const messages = TestBed.inject(MessageService);
    const add = vi.spyOn(messages, 'add');
    const { list } = await createList();
    list.openCreate();
    list.selectedUserId.set(2);
    list.selectedRoleId.set(1);
    list.save();
    http.expectOne(BASE).flush({ error: 'Already exists' }, { status: 400, statusText: 'Bad Request' });
    expect(add).toHaveBeenCalledWith(
      expect.objectContaining({ severity: 'error', summary: 'No se pudo asignar el rol' }),
    );
  });

  it('should deactivate and reload after confirmation', async () => {
    const { list } = await createList();
    acceptConfirmation();
    list.retirar(ASSIGNMENTS[0]);
    const req = http.expectOne(`${BASE}/1/deactivate`);
    expect(req.request.method).toBe('PATCH');
    req.flush({ message: 'Assignment deactivated' });
    http.expectOne(USERS_BASE).flush({ users: USERS });
    http.expectOne(ROLES_BASE).flush({ roles: ROLES });
    http.expectOne(BASE).flush({ assignments: [] });
  });

  it('should not call the backend when the confirmation is rejected', async () => {
    const { list } = await createList();
    vi.spyOn(confirmation, 'confirm').mockImplementation((options) => {
      options.reject?.();
      return confirmation;
    });
    list.retirar(ASSIGNMENTS[0]);
    http.expectNone(`${BASE}/1/deactivate`);
  });
});
