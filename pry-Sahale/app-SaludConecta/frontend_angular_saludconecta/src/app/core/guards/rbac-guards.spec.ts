import { TestBed } from '@angular/core/testing';
import { Router, UrlTree, provideRouter } from '@angular/router';
import { environment } from '../../../environments/environment';
import { SessionStore } from '../services/session-store';
import { authGuard } from './auth-guard';
import { guestGuard } from './guest-guard';

const TOKENS = {
  access_token: 'A',
  token_type: 'Bearer' as const,
  expires_in: 900,
  refresh_token: 'R',
  refresh_expires_in: 604800,
};

async function armar(): Promise<{ store: SessionStore; router: Router }> {
  await TestBed.configureTestingModule({ providers: [provideRouter([])] }).compileComponents();
  return { store: TestBed.inject(SessionStore), router: TestBed.inject(Router) };
}

function ejecutar(guard: typeof authGuard, url: string): boolean | UrlTree {
  return TestBed.runInInjectionContext(() =>
    guard({} as never, { url } as never),
  ) as boolean | UrlTree;
}

describe('authGuard', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('allows the navigation when authenticated', async () => {
    const { store } = await armar();
    store.setTokens(TOKENS);

    expect(ejecutar(authGuard, '/patients')).toBe(true);
  });

  it('redirects to /login with returnUrl when not authenticated', async () => {
    await armar();
    const result = ejecutar(authGuard, '/patients');

    expect(result instanceof UrlTree).toBe(true);
    expect((result as UrlTree).toString()).toContain('/login');
    expect((result as UrlTree).toString()).toContain('returnUrl=%2Fpatients');
  });

  it('allows the navigation when requireAuth is false (lab mode)', async () => {
    const original = environment.requireAuth;
    (environment as { requireAuth: boolean }).requireAuth = false;
    try {
      await armar();
      expect(ejecutar(authGuard, '/patients')).toBe(true);
    } finally {
      (environment as { requireAuth: boolean }).requireAuth = original;
    }
  });
});

describe('guestGuard', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('redirects an authenticated user away from /login', async () => {
    const { store } = await armar();
    store.setTokens(TOKENS);

    const result = ejecutar(guestGuard as typeof authGuard, '/login');
    expect(result instanceof UrlTree).toBe(true);
    expect((result as UrlTree).toString()).toContain('/dashboard');
  });
});
