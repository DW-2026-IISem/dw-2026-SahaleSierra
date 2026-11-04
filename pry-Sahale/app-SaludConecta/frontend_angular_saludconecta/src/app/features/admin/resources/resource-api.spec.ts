import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../../environments/environment';
import { Resource } from '../../../core/models/resource.model';
import { ResourceApi } from './resource-api';

const BASE = `${environment.apiUrl}/resources`;

const RESOURCE: Resource = {
  id: 1,
  method: 'GET',
  path: '/api/patients',
  description: 'Listar pacientes',
  status: 'active',
};

describe('ResourceApi', () => {
  let api: ResourceApi;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    api = TestBed.inject(ResourceApi);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should unwrap { resources } into Resource[]', () => {
    let result: Resource[] | undefined;
    api.list().subscribe((rows) => (result = rows));

    http.expectOne(BASE).flush({ resources: [RESOURCE] });

    expect(result).toEqual([RESOURCE]);
  });

  it('should unwrap { resource } when getting one by id', () => {
    let result: Resource | undefined;
    api.get(1).subscribe((row) => (result = row));

    http.expectOne(`${BASE}/1`).flush({ resource: RESOURCE });

    expect(result).toEqual(RESOURCE);
  });

  it('should POST the payload and unwrap the created resource', () => {
    const payload = {
      method: 'GET' as const,
      path: '/api/patients',
      description: 'Listar pacientes',
      status: 'active' as const,
    };
    let result: Resource | undefined;
    api.create(payload).subscribe((row) => (result = row));

    const request = http.expectOne(BASE);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(payload);
    request.flush({ resource: RESOURCE });

    expect(result).toEqual(RESOURCE);
  });

  it('should PATCH only the sent fields when updating', () => {
    api.update(1, { description: 'Consultar pacientes' }).subscribe();

    const request = http.expectOne(`${BASE}/1`);
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual({ description: 'Consultar pacientes' });
    request.flush({ resource: RESOURCE });
  });

  it('should PUT the full payload when replacing', () => {
    const payload = { method: 'GET' as const, path: '/api/patients', description: 'Ver' };
    api.replace(1, payload).subscribe();

    const request = http.expectOne(`${BASE}/1`);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(payload);
    request.flush({ resource: RESOURCE });
  });

  it('should deactivate with PATCH /:id/deactivate', () => {
    api.deactivate(1).subscribe();

    const request = http.expectOne(`${BASE}/1/deactivate`);
    expect(request.request.method).toBe('PATCH');
    request.flush({ message: 'Resource deactivated' });
  });
});
