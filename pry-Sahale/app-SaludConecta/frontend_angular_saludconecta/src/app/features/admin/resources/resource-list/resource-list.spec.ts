import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from '../../../../../environments/environment';
import { Resource } from '../../../../core/models/resource.model';
import { SessionStore } from '../../../../core/services/session-store';
import { ResourceList } from './resource-list';

const BASE = `${environment.apiUrl}/resources`;

const RESOURCES: Resource[] = [
  { id: 1, method: 'GET', path: '/api/patients', description: 'Listar', status: 'active' },
  { id: 2, method: 'POST', path: '/api/patients', description: 'Crear', status: 'active' },
  { id: 3, method: 'DELETE', path: '/api/patients/:id', description: 'Eliminar', status: 'active' },
];

const PERMS = [
  'GET /api/resources',
  'POST /api/resources',
  'PATCH /api/resources/:id',
  'PATCH /api/resources/:id/deactivate',
  'DELETE /api/resources/:id',
].map((key, i) => {
  const [method, path] = key.split(' ');
  return { resource_id: i + 1, method: method as 'GET' | 'POST' | 'PATCH' | 'DELETE', path, description: null, role_id: 1, role_name: 'ADMIN' };
});

describe('ResourceList', () => {
  let http: HttpTestingController;
  let confirmation: ConfirmationService;

  beforeEach(async () => {
    localStorage.clear();
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [ResourceList],
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

  async function createList(rows: Resource[] = RESOURCES) {
    const fixture = TestBed.createComponent(ResourceList);
    http.expectOne(BASE).flush({ resources: rows });
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

  it('should load resources and filter by path', async () => {
    const { fixture, list } = await createList();
    expect(list.rows().length).toBe(3);
    list.filter.set('patients');
    fixture.detectChanges();
    expect(list.visibleRows().length).toBe(3);
    http.expectNone(BASE);
  });

  it('should show the backend error on load failure', async () => {
    const fixture = TestBed.createComponent(ResourceList);
    http.expectOne(BASE).flush({ error: 'Forbidden' }, { status: 403, statusText: 'Forbidden' });
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.componentInstance.error()).toBe('Forbidden');
    expect(fixture.componentInstance.rows()).toEqual([]);
  });

  it('should filter by method (client-side)', async () => {
    const { fixture, list } = await createList();
    list.methodFilter.set('POST');
    fixture.detectChanges();
    expect(list.visibleRows().map((r) => r.id)).toEqual([2]);
  });

  it('should count methods', async () => {
    const { list } = await createList();
    const counts = list.countsByMethod();
    expect(counts.get('GET')).toBe(1);
    expect(counts.get('POST')).toBe(1);
    expect(counts.get('DELETE')).toBe(1);
  });

  it('should POST a new resource and reload', async () => {
    const { list } = await createList();
    list.openCreate();
    list.save({ method: 'PUT', path: '/api/patients/:id', description: 'Reemplazar' });
    const req = http.expectOne(BASE);
    expect(req.request.method).toBe('POST');
    req.flush({ resource: { id: 4, method: 'PUT', path: '/api/patients/:id', description: 'Reemplazar', status: 'active' } });
    http.expectOne(BASE).flush({ resources: RESOURCES });
  });

  it('should PATCH when editing', async () => {
    const { list } = await createList();
    list.openEdit(RESOURCES[0]);
    list.save({ method: 'GET', path: '/api/patients', description: 'Ver' });
    const req = http.expectOne(`${BASE}/1`);
    expect(req.request.method).toBe('PATCH');
    req.flush({ resource: RESOURCES[0] });
    http.expectOne(BASE).flush({ resources: RESOURCES });
  });

  it('should deactivate and reload', async () => {
    const { list } = await createList();
    acceptConfirmation();
    list.deactivate(RESOURCES[0]);
    const req = http.expectOne(`${BASE}/1/deactivate`);
    expect(req.request.method).toBe('PATCH');
    req.flush({ message: 'Resource deactivated' });
    http.expectOne(BASE).flush({ resources: RESOURCES.slice(1) });
  });

  it('should remove and reload', async () => {
    const { list } = await createList();
    acceptConfirmation();
    list.remove(RESOURCES[2]);
    const req = http.expectOne(`${BASE}/3`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'Resource deleted' });
    http.expectOne(BASE).flush({ resources: RESOURCES.slice(0, 2) });
  });

  it('should map method to severity', async () => {
    const { list } = await createList();
    expect(list.severityFor('GET')).toBe('info');
    expect(list.severityFor('POST')).toBe('success');
    expect(list.severityFor('PUT')).toBe('warn');
    expect(list.severityFor('PATCH')).toBe('warn');
    expect(list.severityFor('DELETE')).toBe('danger');
  });
});
