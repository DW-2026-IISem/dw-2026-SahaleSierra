import { TestBed } from '@angular/core/testing';
import { SessionStore } from './session-store';

const STORAGE_KEY = 'storelab.session.v1';

const PERMISSIONS = [
  { resource_id: 1, method: 'GET' as const, path: '/api/patients', description: 'Listar', role_id: 1, role_name: 'ADMIN' },
  { resource_id: 2, method: 'GET' as const, path: '/api/patients/:id', description: 'Consultar', role_id: 1, role_name: 'ADMIN' },
  { resource_id: 3, method: 'POST' as const, path: '/api/patients', description: 'Crear', role_id: 1, role_name: 'ADMIN' },
];

describe('SessionStore', () => {
  let store: SessionStore;

  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    store = TestBed.inject(SessionStore);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('starts with no session and authEnabled from environment', () => {
    expect(store.isAuthenticated()).toBe(false);
    expect(store.accessToken()).toBeNull();
    expect(store.refreshToken()).toBeNull();
    expect(store.user()).toBeNull();
    expect(store.permissions()).toEqual([]);
    expect(store.authEnabled).toBe(true);
  });

  it('setTokens stores both tokens and persists', () => {
    store.setTokens({
      access_token: 'A',
      token_type: 'Bearer',
      expires_in: 900,
      refresh_token: 'R',
      refresh_expires_in: 604800,
    });

    expect(store.accessToken()).toBe('A');
    expect(store.refreshToken()).toBe('R');

    const raw = localStorage.getItem(STORAGE_KEY);
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw!);
    expect(parsed.accessToken).toBe('A');
    expect(parsed.refreshToken).toBe('R');
  });

  it('setAccess stores the user and permissions and derives roleNames', () => {
    store.setAccess({
      user: { id: 1, username: 'admin', email: 'a@b', avatar: null, status: 'active' },
      permissions: PERMISSIONS,
    });

    expect(store.user()?.username).toBe('admin');
    expect(store.permissionCount()).toBe(3);
    expect(store.roleNames()).toEqual(['ADMIN']);
    expect(store.roles().map((r) => r.id)).toEqual([1]);
    expect(store.resources().map((r) => r.id)).toEqual([1, 2, 3]);
  });

  it('can() matches exact paths', () => {
    store.setAccess({
      user: { id: 1, username: 'admin', email: 'a@b', avatar: null, status: 'active' },
      permissions: PERMISSIONS,
    });

    expect(store.can('GET', '/api/patients')).toBe(true);
    expect(store.can('GET', '/api/patients/7')).toBe(true);
    expect(store.can('POST', '/api/patients')).toBe(true);
    expect(store.can('DELETE', '/api/patients/7')).toBe(false);
  });

  it('canPermission parses "MÉTODO /ruta" strings', () => {
    store.setAccess({
      user: { id: 1, username: 'admin', email: 'a@b', avatar: null, status: 'active' },
      permissions: PERMISSIONS,
    });

    expect(store.canPermission('GET /api/patients/7')).toBe(true);
    expect(store.canPermission('DELETE /api/patients/7')).toBe(false);
    expect(store.canPermission('sin-espacio')).toBe(false);
  });

  it('restore recovers the persisted session', () => {
    store.setTokens({
      access_token: 'A',
      token_type: 'Bearer',
      expires_in: 900,
      refresh_token: 'R',
      refresh_expires_in: 604800,
    });
    store.setAccess({
      user: { id: 1, username: 'admin', email: 'a@b', avatar: null, status: 'active' },
      permissions: PERMISSIONS,
    });

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const restored = TestBed.inject(SessionStore);

    expect(restored.accessToken()).toBe('A');
    expect(restored.refreshToken()).toBe('R');
    expect(restored.user()?.username).toBe('admin');
    expect(restored.permissionCount()).toBe(3);
  });

  it('restore discards a session without permissions array', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ accessToken: 'A', refreshToken: 'R', user: null, permissions: 'bad' }),
    );

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const restored = TestBed.inject(SessionStore);

    expect(restored.isAuthenticated()).toBe(false);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('clear wipes state and storage', () => {
    store.setTokens({
      access_token: 'A',
      token_type: 'Bearer',
      expires_in: 900,
      refresh_token: 'R',
      refresh_expires_in: 604800,
    });
    store.setAccess({
      user: { id: 1, username: 'admin', email: 'a@b', avatar: null, status: 'active' },
      permissions: PERMISSIONS,
    });

    store.clear();

    expect(store.isAuthenticated()).toBe(false);
    expect(store.permissions()).toEqual([]);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});
