import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { AccessPayload, SessionTokens } from '../models/auth.model';
import { AuthService } from './auth';
import { SessionStore } from './session-store';

const API = environment.apiUrl;

const TOKENS: SessionTokens = {
  access_token: 'A',
  token_type: 'Bearer',
  expires_in: 900,
  refresh_token: 'R',
  refresh_expires_in: 604800,
};

const TOKENS_ROTATED: SessionTokens = { ...TOKENS, access_token: 'A2', refresh_token: 'R2' };

const PERMISSIONS = [
  {
    resource_id: 1,
    method: 'GET' as const,
    path: '/api/patients',
    description: 'Listar',
    role_id: 1,
    role_name: 'ADMIN',
  },
];

const ACCESS: AccessPayload = {
  user: { id: 1, username: 'admin', email: 'a@b', avatar: null, status: 'active' },
  permissions: PERMISSIONS,
};

describe('AuthService', () => {
  let service: AuthService;
  let store: SessionStore;
  let http: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    store = TestBed.inject(SessionStore);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Sin `http.verify()` global: cada test responde sus peticiones. `verify()`
    // aquí contaminaba la suite cuando `forkJoin` cancelaba una petición en
    // vuelo y dejaba una "abierta" a ojos de `HttpTestingController`.
    localStorage.clear();
  });

  it('login stores tokens and loads profile + permissions', () => {
    let result: AccessPayload | undefined;
    service.login({ identifier: 'admin', password: 'Admin123!' }).subscribe((a) => (result = a));

    const login = http.expectOne(`${API}/session/login`);
    expect(login.request.method).toBe('POST');
    expect(login.request.body).toEqual({ identifier: 'admin', password: 'Admin123!' });
    login.flush(TOKENS);

    expect(store.accessToken()).toBe('A');
    expect(store.refreshToken()).toBe('R');

    http.expectOne(`${API}/session/profile`).flush({
      user: { id: 1, username: 'admin', email: 'a@b', avatar: null, status: 'active' },
    });
    http.expectOne(`${API}/permissions`).flush({ permissions: PERMISSIONS });

    expect(result).toEqual(ACCESS);
    expect(store.user()?.username).toBe('admin');
    expect(store.permissionCount()).toBe(1);
  });

  it('login clears the session when me() fails', () => {
    let failed = false;
    service.login({ identifier: 'admin', password: 'Bad' }).subscribe({
      error: () => (failed = true),
    });

    http.expectOne(`${API}/session/login`).flush(TOKENS);
    expect(store.accessToken()).toBe('A');

    // `forkJoin(profile, permissions)` abre dos peticiones. Al responder
    // `profile` con 500, forkJoin **cancela** `permissions`; por eso no se
    // responde (una request cancelada no admite `flush`).
    http
      .expectOne(`${API}/session/profile`)
      .flush({ error: 'Internal server error' }, { status: 500, statusText: 'Server Error' });

    expect(failed).toBe(true);
    expect(store.accessToken()).toBeNull();
    expect(store.refreshToken()).toBeNull();
    expect(store.permissions()).toEqual([]);
  });

  it('login propagates a 401 without refreshing', () => {
    let status: number | undefined;
    service.login({ identifier: 'admin', password: 'Bad' }).subscribe({
      error: (error) => (status = error.status),
    });

    http
      .expectOne(`${API}/session/login`)
      .flush({ error: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });

    expect(status).toBe(401);
    http.expectNone(`${API}/session/refresh`);
  });

  it('refresh posts the current refresh_token and rotates', () => {
    store.setTokens(TOKENS);

    let result: SessionTokens | undefined;
    service.refresh().subscribe((t) => (result = t));

    const call = http.expectOne(`${API}/session/refresh`);
    expect(call.request.method).toBe('POST');
    expect(call.request.body).toEqual({ refresh_token: 'R' });
    call.flush(TOKENS_ROTATED);

    expect(result?.access_token).toBe('A2');
    expect(store.accessToken()).toBe('A2');
    expect(store.refreshToken()).toBe('R2');
  });

  it('refresh errors immediately without a stored refresh_token', () => {
    let message: string | undefined;
    service.refresh().subscribe({
      error: (error) => (message = error.message),
    });

    expect(message).toContain('No hay refresh token');
    http.expectNone(`${API}/session/refresh`);
  });

  it('logout clears state even when the backend fails', () => {
    store.setTokens(TOKENS);
    let completed = false;

    service.logout().subscribe({
      complete: () => (completed = true),
    });

    http
      .expectOne(`${API}/session/logout`)
      .flush({ error: 'Server down' }, { status: 500, statusText: 'Server Error' });

    expect(completed).toBe(true);
    expect(store.isAuthenticated()).toBe(false);
    expect(store.refreshToken()).toBeNull();
    expect(localStorage.getItem('storelab.session.v1')).toBeNull();
  });

  it('logout clears locally without a refresh token and does not call the backend', () => {
    let completed = false;

    service.logout().subscribe({
      complete: () => (completed = true),
    });

    expect(completed).toBe(true);
    expect(store.isAuthenticated()).toBe(false);
    http.expectNone(`${API}/session/logout`);
  });
});
