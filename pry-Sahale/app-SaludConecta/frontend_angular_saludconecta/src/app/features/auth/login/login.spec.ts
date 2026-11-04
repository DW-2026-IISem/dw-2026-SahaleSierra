import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap, provideRouter } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { SessionTokens } from '../../../core/models/auth.model';
import { Login } from './login';

const API = environment.apiUrl;

const TOKENS: SessionTokens = {
  access_token: 'A',
  token_type: 'Bearer',
  expires_in: 900,
  refresh_token: 'R',
  refresh_expires_in: 604800,
};

async function configurar(returnUrl: string | null): Promise<void> {
  await TestBed.configureTestingModule({
    imports: [Login],
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      provideRouter([]),
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            queryParamMap: convertToParamMap(returnUrl ? { returnUrl } : {}),
          },
        },
      },
    ],
  }).compileComponents();
}

describe('Login', () => {
  let http: HttpTestingController;
  let navigateByUrl: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    http.verify();
  });

  function preparar(returnUrl: string | null): Login {
    const fixture = TestBed.createComponent(Login);
    http = TestBed.inject(HttpTestingController);
    navigateByUrl = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
    fixture.componentInstance['route'];
    return fixture.componentInstance;
  }

  function completarLogin(): void {
    http.expectOne(`${API}/session/login`).flush(TOKENS);
    http.expectOne(`${API}/session/profile`).flush({
      user: { id: 1, username: 'admin', email: 'a@b', avatar: null, status: 'active' },
    });
    http.expectOne(`${API}/permissions`).flush({ permissions: [] });
  }

  it('navigates to a safe returnUrl after a successful login', async () => {
    await configurar('/patients');
    const component = preparar('/patients');
    component.form.setValue({ identifier: 'admin', password: 'Admin123!' });

    component.submit();
    completarLogin();

    expect(navigateByUrl).toHaveBeenCalledWith('/patients');
  });

  it('ignores a returnUrl that points to another domain', async () => {
    await configurar('https://evil.example/phish');
    const component = preparar('https://evil.example/phish');
    component.form.setValue({ identifier: 'admin', password: 'Admin123!' });

    component.submit();
    completarLogin();

    expect(navigateByUrl).toHaveBeenCalledWith('/dashboard');
  });

  it('ignores a returnUrl that points back to /login', async () => {
    await configurar('/login');
    const component = preparar('/login');
    component.form.setValue({ identifier: 'admin', password: 'Admin123!' });

    component.submit();
    completarLogin();

    expect(navigateByUrl).toHaveBeenCalledWith('/dashboard');
  });

  it('shows the backend message when credentials are wrong and does not navigate', async () => {
    await configurar(null);
    const component = preparar(null);
    component.form.setValue({ identifier: 'admin', password: 'Bad' });

    component.submit();
    http
      .expectOne(`${API}/session/login`)
      .flush({ error: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });

    expect(component.error()).toBe('Invalid credentials');
    expect(navigateByUrl).not.toHaveBeenCalled();
  });
});
