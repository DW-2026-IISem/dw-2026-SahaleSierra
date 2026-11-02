import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { Service } from '../../core/models/service.model';
import { ServiceApi } from './service-api';

const BASE = `${environment.apiUrl}/services`;

const SERVICE: Service = {
  id: 1,
  name: 'Consulta de medicina general',
  description: 'Valoración médica general',
  status: 'active',
};

describe('ServiceApi', () => {
  let api: ServiceApi;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    api = TestBed.inject(ServiceApi);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should unwrap { services } into Service[]', () => {
    let result: Service[] | undefined;
    api.list().subscribe((rows) => (result = rows));

    const request = http.expectOne(BASE);
    expect(request.request.method).toBe('GET');
    request.flush({ services: [SERVICE] });

    expect(result).toEqual([SERVICE]);
  });

  it('should unwrap { service } when getting one by id', () => {
    let result: Service | undefined;
    api.get(1).subscribe((row) => (result = row));

    http.expectOne(`${BASE}/1`).flush({ service: SERVICE });

    expect(result).toEqual(SERVICE);
  });

  it('should POST the payload and unwrap the created service', () => {
    let result: Service | undefined;
    api.create({ name: 'Consulta de medicina general', description: null, status: 'active' }).subscribe(
      (row) => (result = row),
    );

    const request = http.expectOne(BASE);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ name: 'Consulta de medicina general', description: null, status: 'active' });
    request.flush({ service: SERVICE });

    expect(result).toEqual(SERVICE);
  });

  it('should PATCH only the sent fields when updating', () => {
    api.update(1, { name: 'Consulta general programada' }).subscribe();

    const request = http.expectOne(`${BASE}/1`);
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual({ name: 'Consulta general programada' });
    request.flush({ service: { ...SERVICE, name: 'Consulta general programada' } });
  });

  it('should deactivate with PATCH /:id/deactivate', () => {
    api.deactivate(1).subscribe();

    const request = http.expectOne(`${BASE}/1/deactivate`);
    expect(request.request.method).toBe('PATCH');
    request.flush({ message: 'Service deactivated (logical delete)', service: SERVICE });
  });

  it('should delete with DELETE /:id', () => {
    api.remove(1).subscribe();

    const request = http.expectOne(`${BASE}/1`);
    expect(request.request.method).toBe('DELETE');
    request.flush({ message: 'Service permanently deleted', id: 1 });
  });
});
