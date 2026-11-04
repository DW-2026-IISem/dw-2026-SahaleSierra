import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from '../../../../../environments/environment';
import { SessionStore } from '../../../../core/services/session-store';
import { User } from '../../../../core/models/user.model';
import { UserList } from './user-list';

const BASE = `${environment.apiUrl}/users`;

const ADMIN_PERMISSIONS = [
  'GET /api/users',
  'POST /api/users',
  'PATCH /api/users/:id',
  'PATCH /api/users/:id/password',
  'GET /api/users/:id/permissions',
  'PATCH /api/users/:id/deactivate',
  'DELETE /api/users/:id',
].map((key, i) => {
  const [method, path] = key.split(' ');
  return {
    resource_id: i + 1,
    method: method as 'GET' | 'POST' | 'PATCH' | 'DELETE',
    path,
    description: null,
    role_id: 1,
    role_name: 'ADMIN',
  };
});

const USERS: User[] = [
  { id: 1, username: 'admin', email: 'admin@saludconecta.local', avatar: null, status: 'active' },
  { id: 2, username: 'medico', email: 'medico@saludconecta.local', avatar: null, status: 'active' },
];

describe('UserList', () => {
  let http: HttpTestingController;
  let confirmation: ConfirmationService;
  let messages: MessageService;

  beforeEach(async () => {
    localStorage.clear();
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [UserList],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        MessageService,
        ConfirmationService,
      ],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
    confirmation = TestBed.inject(ConfirmationService);
    messages = TestBed.inject(MessageService);
    prepararSesion();
  });

  afterEach(() => {
    localStorage.clear();
  });

  function prepararSesion(): void {
    const store = TestBed.inject(SessionStore);
    store.setTokens({
      access_token: 'A',
      token_type: 'Bearer',
      expires_in: 900,
      refresh_token: 'R',
      refresh_expires_in: 604800,
    });
    store.setAccess({
      user: { id: 1, username: 'admin', email: 'admin@saludconecta.local', avatar: null, status: 'active' },
      permissions: ADMIN_PERMISSIONS,
    });
  }

  async function createList(rows: User[] = USERS) {
    const fixture = TestBed.createComponent(UserList);
    http.expectOne(BASE).flush({ users: rows });
    await fixture.whenStable();
    fixture.detectChanges();
    return { fixture, list: fixture.componentInstance, compiled: fixture.nativeElement as HTMLElement };
  }

  function acceptConfirmation(): void {
    vi.spyOn(confirmation, 'confirm').mockImplementation((options) => {
      options.accept?.();
      return confirmation;
    });
  }

  it('should load users and filter by username or email', async () => {
    const { fixture, list } = await createList();
    expect(list.rows().length).toBe(2);
    list.filter.set('medico');
    fixture.detectChanges();
    expect(list.visibleRows().map((u) => u.id)).toEqual([2]);
    http.expectNone(BASE);
  });

  it('should show the backend error and empty table when the load fails', async () => {
    const fixture = TestBed.createComponent(UserList);
    http.expectOne(BASE).flush({ error: 'Forbidden' }, { status: 403, statusText: 'Forbidden' });
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.componentInstance.error()).toBe('Forbidden');
    expect(fixture.componentInstance.rows()).toEqual([]);
  });

  it('should POST the new user and reload the list', async () => {
    const { list } = await createList();
    list.openCreate();
    list.save({ username: 'nuevo', email: 'nuevo@b', password: 'Abc12345', avatar: null });
    const creation = http.expectOne(BASE);
    expect(creation.request.method).toBe('POST');
    creation.flush({ user: { id: 3, username: 'nuevo', email: 'nuevo@b', avatar: null, status: 'active' } });
    http.expectOne(BASE).flush({ users: [...USERS, { id: 3, username: 'nuevo', email: 'nuevo@b', avatar: null, status: 'active' }] });
    expect(list.rows().length).toBe(3);
  });

  it('should PATCH only the sent fields when editing', async () => {
    const { list } = await createList();
    list.openEdit(USERS[0]);
    list.save({ username: 'admin', email: 'admin2@b', avatar: null });
    const change = http.expectOne(`${BASE}/1`);
    expect(change.request.method).toBe('PATCH');
    expect('password' in change.request.body).toBe(false);
    expect('status' in change.request.body).toBe(false);
    change.flush({ user: USERS[0] });
    http.expectOne(BASE).flush({ users: USERS });
  });

  it('should change password via PATCH /:id/password', async () => {
    const { list } = await createList();
    list.openPassword(USERS[0]);
    list.passwordForm.patchValue({ current_password: 'Admin123!', new_password: 'Nueva456!' });
    list.savePassword();
    const req = http.expectOne(`${BASE}/1/password`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ current_password: 'Admin123!', new_password: 'Nueva456!' });
    req.flush({ message: 'Password updated' });
  });

  it('should open the permissions dialog and unwrap { permissions }', async () => {
    const { list } = await createList();
    list.viewPermissions(USERS[0]);
    http.expectOne(`${BASE}/1/permissions`).flush({
      permissions: [ADMIN_PERMISSIONS[0], ADMIN_PERMISSIONS[1]],
    });
    await Promise.resolve();
    expect(list.permissionsRows().length).toBe(2);
    expect(list.permissionsRoles().length).toBe(1);
  });

  it('should deactivate and reload after confirmation', async () => {
    const { list } = await createList();
    acceptConfirmation();
    list.deactivate(USERS[0]);
    const req = http.expectOne(`${BASE}/1/deactivate`);
    expect(req.request.method).toBe('PATCH');
    req.flush({ message: 'User deactivated' });
    http.expectOne(BASE).flush({ users: USERS.slice(1) });
  });

  it('should remove and reload after confirmation', async () => {
    const { list } = await createList();
    acceptConfirmation();
    list.remove(USERS[1]);
    const req = http.expectOne(`${BASE}/2`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'User deleted' });
    http.expectOne(BASE).flush({ users: USERS.slice(0, 1) });
  });

  it('should show the error toast when save fails', async () => {
    const { list } = await createList();
    const add = vi.spyOn(messages, 'add');
    list.openCreate();
    list.save({ username: 'nuevo', email: 'nuevo@b', password: 'Abc12345', avatar: null });
    http.expectOne(BASE).flush(
      { error: 'Username already in use' },
      { status: 409, statusText: 'Conflict' },
    );
    expect(add).toHaveBeenCalledWith(
      expect.objectContaining({ severity: 'error', summary: 'No se pudo guardar' }),
    );
  });
});
