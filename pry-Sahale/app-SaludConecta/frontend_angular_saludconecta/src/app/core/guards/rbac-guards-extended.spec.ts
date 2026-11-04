import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, UrlTree, provideRouter } from '@angular/router';
import { environment } from '../../../environments/environment';
import { SessionStore } from '../services/session-store';
import { authOnlyGuard } from './auth-only-guard';
import { permissionGuard } from './permission-guard';

const TOKENS = {
  access_token: 'A',
  token_type: 'Bearer' as const,
  expires_in: 900,
  refresh_token: 'R',
  refresh_expires_in: 604800,
};

const PATIENTS_PERMISSION = {
  resource_id: 1,
  method: 'GET' as const,
  path: '/api/patients',
  description: 'Listar',
  role_id: 1,
  role_name: 'ADMIN',
};

async function armar(): Promise<{ store: SessionStore; router: Router }> {
  await TestBed.configureTestingModule({
    providers: [provideRouter([{ path: 'forbidden', children: [] }, { path: 'dashboard', children: [] }])],
  }).compileComponents();
  return { store: TestBed.inject(SessionStore), router: TestBed.inject(Router) };
}

function routeWith(permission?: string): ActivatedRouteSnapshot {
  return { data: permission ? { permission } : {} } as unknown as ActivatedRouteSnapshot;
}

function ejecutarPermission(route: ActivatedRouteSnapshot): boolean | UrlTree {
  return TestBed.runInInjectionContext(() => permissionGuard(route, {} as never)) as
    | boolean
    | UrlTree;
}

function ejecutarAuthOnly(): boolean | UrlTree {
  return TestBed.runInInjectionContext(() => authOnlyGuard({} as never, {} as never)) as
    | boolean
    | UrlTree;
}

describe('permissionGuard', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
  });
  afterEach(() => localStorage.clear());

  it('allows the navigation when the session has the permission', async () => {
    const { store } = await armar();
    store.setTokens(TOKENS);
    store.setAccess({
      user: { id: 1, username: 'admin', email: 'a@b', avatar: null, status: 'active' },
      permissions: [PATIENTS_PERMISSION],
    });

    expect(ejecutarPermission(routeWith('GET /api/patients'))).toBe(true);
  });

  it('redirects to /forbidden when the permission is missing', async () => {
    const { store } = await armar();
    store.setTokens(TOKENS);
    store.setAccess({
      user: { id: 1, username: 'medico', email: 'm@b', avatar: null, status: 'active' },
      permissions: [],
    });

    const result = ejecutarPermission(routeWith('GET /api/patients'));

    expect(result instanceof UrlTree).toBe(true);
    expect((result as UrlTree).toString()).toContain('/forbidden');
    expect((result as UrlTree).toString()).toContain('permission=GET%20%2Fapi%2Fpatients');
  });

  it('allows the navigation when the route does not declare a permission', async () => {
    await armar();

    expect(ejecutarPermission(routeWith(undefined))).toBe(true);
  });

  it('allows everything when requireAuth is false (lab mode)', async () => {
    const original = environment.requireAuth;
    (environment as { requireAuth: boolean }).requireAuth = false;
    try {
      await armar();
      expect(ejecutarPermission(routeWith('GET /api/patients'))).toBe(true);
    } finally {
      (environment as { requireAuth: boolean }).requireAuth = original;
    }
  });
});

describe('authOnlyGuard', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
  });
  afterEach(() => localStorage.clear());

  it('allows /profile when authEnabled is true', async () => {
    await armar();

    expect(ejecutarAuthOnly()).toBe(true);
  });

  it('redirects /profile to /dashboard when authEnabled is false', async () => {
    const original = environment.requireAuth;
    (environment as { requireAuth: boolean }).requireAuth = false;
    try {
      await armar();
      const result = ejecutarAuthOnly();

      expect(result instanceof UrlTree).toBe(true);
      expect((result as UrlTree).toString()).toContain('/dashboard');
    } finally {
      (environment as { requireAuth: boolean }).requireAuth = original;
    }
  });
});
