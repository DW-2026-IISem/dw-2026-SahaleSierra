import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { environment } from '../../../environments/environment';
import { errorInterceptor } from './error-interceptor';

const API = environment.apiUrl;

describe('errorInterceptor', () => {
  let http: HttpClient;
  let ctrl: HttpTestingController;
  let messages: MessageService;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        MessageService,
      ],
    });
    http = TestBed.inject(HttpClient);
    ctrl = TestBed.inject(HttpTestingController);
    messages = TestBed.inject(MessageService);
  });

  afterEach(() => ctrl.verify());

  function expectToast(severity: 'error' | 'warn', summary: string) {
    const add = vi.spyOn(messages, 'add');
    return { add, severity, summary };
  }

  it('shows a toast on 403 and propagates the error', () => {
    const add = vi.spyOn(messages, 'add');
    let status: number | undefined;

    http.get(`${API}/admin/users`).subscribe({
      error: (error) => (status = error.status),
    });

    ctrl
      .expectOne(`${API}/admin/users`)
      .flush({ error: 'Forbidden: no grant for GET /api/admin/users' }, { status: 403, statusText: 'Forbidden' });

    expect(status).toBe(403);
    expect(add).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: 'error',
        summary: 'Acción no permitida',
      }),
    );
  });

  it('shows a toast on 500 and propagates the error', () => {
    const add = vi.spyOn(messages, 'add');

    http.get(`${API}/patients`).subscribe({ error: () => undefined });

    ctrl
      .expectOne(`${API}/patients`)
      .flush({ error: 'Internal server error', detail: 'SequelizeUniqueConstraintError' }, { status: 500, statusText: 'Server Error' });

    expect(add).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: 'error',
        summary: 'Error del servidor',
        detail: expect.stringContaining('Ya existe un registro'),
      }),
    );
  });

  it('shows a toast on status 0 (backend down) and propagates the error', () => {
    const add = vi.spyOn(messages, 'add');

    http.get(`${API}/patients`).subscribe({ error: () => undefined });

    ctrl
      .expectOne(`${API}/patients`)
      .error(new ProgressEvent('error'), { status: 0, statusText: 'Unknown Error' });

    expect(add).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: 'error',
        summary: 'Backend no disponible',
      }),
    );
  });

  it('does not show a toast on 400 or 404', () => {
    const add = vi.spyOn(messages, 'add');

    http.get(`${API}/patients/9999`).subscribe({ error: () => undefined });
    ctrl
      .expectOne(`${API}/patients/9999`)
      .flush({ error: 'Patient not found' }, { status: 404, statusText: 'Not Found' });

    http.post(`${API}/patients`, {}).subscribe({ error: () => undefined });
    ctrl
      .expectOne(`${API}/patients`)
      .flush({ error: 'Validation error' }, { status: 400, statusText: 'Bad Request' });

    expect(add).not.toHaveBeenCalled();
  });

  it('does not show a toast on 401 (authInterceptor owns it)', () => {
    const add = vi.spyOn(messages, 'add');

    http.get(`${API}/patients`).subscribe({ error: () => undefined });
    ctrl
      .expectOne(`${API}/patients`)
      .flush({ error: 'Missing Bearer token' }, { status: 401, statusText: 'Unauthorized' });

    expect(add).not.toHaveBeenCalled();
  });
});
