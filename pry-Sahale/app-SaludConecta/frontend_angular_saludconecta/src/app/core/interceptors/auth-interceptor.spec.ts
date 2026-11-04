import { Component } from '@angular/core';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { environment } from '../../../environments/environment';
import { SessionTokens } from '../models/auth.model';
import { SessionStore } from '../services/session-store';
import { authInterceptor } from './auth-interceptor';

const API = environment.apiUrl;

/** Ruta mínima para que `router.navigate(['/login'])` resuelva en las pruebas. */
@Component({ selector: 'app-test-login', template: '' })
class TestLoginComponent {}

const TOKENS: SessionTokens = {
  access_token: 'A',
  token_type: 'Bearer',
  expires_in: 900,
  refresh_token: 'R',
  refresh_expires_in: 604800,
};

const ROTATED: SessionTokens = { ...TOKENS, access_token: 'A2', refresh_token: 'R2' };

describe('authInterceptor', () => {
  let http: HttpClient;
  let ctrl: HttpTestingController;
  let store: SessionStore;
  let router: Router;

  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        provideRouter([{ path: 'login', component: TestLoginComponent }]),
      ],
    });
    http = TestBed.inject(HttpClient);
    ctrl = TestBed.inject(HttpTestingController);
    store = TestBed.inject(SessionStore);
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('attaches Authorization: Bearer <access> to business calls', () => {
    store.setTokens(TOKENS);

    http.get(`${API}/patients`).subscribe();

    const request = ctrl.expectOne(`${API}/patients`);
    expect(request.request.headers.get('Authorization')).toBe('Bearer A');
    request.flush({ patients: [] });
  });

  it('does not attach Authorization to login, refresh or logout', () => {
    store.setTokens(TOKENS);

    http.post(`${API}/session/login`, {}).subscribe();
    http.post(`${API}/session/refresh`, {}).subscribe();
    http.post(`${API}/session/logout`, {}).subscribe();

    for (const url of [`${API}/session/login`, `${API}/session/refresh`, `${API}/session/logout`]) {
      const request = ctrl.expectOne(url);
      expect(request.request.headers.get('Authorization')).toBeNull();
      request.flush({});
    }
  });

  it('shares a single refresh across concurrent 401s and retries each', () => {
    store.setTokens(TOKENS);

    http.get(`${API}/patients`).subscribe();
    http.get(`${API}/appointments`).subscribe();
    http.get(`${API}/invoices`).subscribe();

    for (const url of [`${API}/patients`, `${API}/appointments`, `${API}/invoices`]) {
      ctrl.expectOne(url).flush(
        { error: 'Invalid or expired access token' },
        { status: 401, statusText: 'Unauthorized' },
      );
    }

    const refresh = ctrl.expectOne(`${API}/session/refresh`);
    expect(refresh.request.body).toEqual({ refresh_token: 'R' });
    refresh.flush(ROTATED);

    for (const url of [`${API}/patients`, `${API}/appointments`, `${API}/invoices`]) {
      const retry = ctrl.expectOne(url);
      expect(retry.request.headers.get('Authorization')).toBe('Bearer A2');
      retry.flush({ ok: true });
    }
  });

  it('on reuse detection: refreshes, gets 401 and clears the session', () => {
    store.setTokens(TOKENS);

    http.get(`${API}/patients`).subscribe({
      error: () => undefined,
    });

    ctrl
      .expectOne(`${API}/patients`)
      .flush(
        { error: 'Invalid or expired access token' },
        { status: 401, statusText: 'Unauthorized' },
      );

    ctrl
      .expectOne(`${API}/session/refresh`)
      .flush(
        { error: 'Refresh token reuse detected: session family revoked' },
        { status: 401, statusText: 'Unauthorized' },
      );

    expect(store.isAuthenticated()).toBe(false);
    expect(store.refreshToken()).toBeNull();
  });

  it('propagates the 401 without refreshing when requireAuth is false', () => {
    const original = environment.requireAuth;
    (environment as { requireAuth: boolean }).requireAuth = false;
    try {
      let status: number | undefined;
      http.get(`${API}/patients`).subscribe({
        error: (error) => (status = error.status),
      });

      ctrl
        .expectOne(`${API}/patients`)
        .flush(
          { error: 'Missing Bearer token' },
          { status: 401, statusText: 'Unauthorized' },
        );

      expect(status).toBe(401);
      ctrl.expectNone(`${API}/session/refresh`);
    } finally {
      (environment as { requireAuth: boolean }).requireAuth = original;
    }
  });

  it('does not attempt a refresh when there is no refresh token', () => {
    http.get(`${API}/patients`).subscribe({
      error: () => undefined,
    });

    ctrl
      .expectOne(`${API}/patients`)
      .flush(
        { error: 'Missing Bearer token' },
        { status: 401, statusText: 'Unauthorized' },
      );

    ctrl.expectNone(`${API}/session/refresh`);
    expect(store.isAuthenticated()).toBe(false);
  });
});
