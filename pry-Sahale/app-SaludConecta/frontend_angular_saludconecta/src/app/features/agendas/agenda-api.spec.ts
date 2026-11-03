import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { Agenda } from '../../core/models/agenda.model';
import { AgendaApi } from './agenda-api';

const BASE = `${environment.apiUrl}/agendas`;

const AGENDA: Agenda = {
  id: 1,
  name: 'Consulta externa · mañana',
  description: 'Lunes a viernes, 7:00 a 12:00',
  doctor_id: 1,
  status: 'active',
};

describe('AgendaApi', () => {
  let api: AgendaApi;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    api = TestBed.inject(AgendaApi);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should unwrap { agendas } into Agenda[]', () => {
    let result: Agenda[] | undefined;
    api.list().subscribe((rows) => (result = rows));

    const request = http.expectOne(BASE);
    expect(request.request.method).toBe('GET');
    request.flush({ agendas: [AGENDA] });

    expect(result).toEqual([AGENDA]);
  });

  it('should unwrap { agenda } when getting one by id', () => {
    let result: Agenda | undefined;
    api.get(1).subscribe((row) => (result = row));

    http.expectOne(`${BASE}/1`).flush({ agenda: AGENDA });

    expect(result).toEqual(AGENDA);
  });

  it('should POST the payload with the doctor_id and unwrap the created agenda', () => {
    let result: Agenda | undefined;
    const payload = {
      name: 'Consulta externa · mañana',
      description: null,
      doctor_id: 1,
      status: 'active' as const,
    };
    api.create(payload).subscribe((row) => (result = row));

    const request = http.expectOne(BASE);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(payload);
    request.flush({ agenda: AGENDA });

    expect(result).toEqual(AGENDA);
  });

  it('should PATCH only the sent fields when updating', () => {
    api.update(1, { doctor_id: 2 }).subscribe();

    const request = http.expectOne(`${BASE}/1`);
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual({ doctor_id: 2 });
    request.flush({ agenda: { ...AGENDA, doctor_id: 2 } });
  });

  it('should deactivate with PATCH /:id/deactivate', () => {
    api.deactivate(1).subscribe();

    const request = http.expectOne(`${BASE}/1/deactivate`);
    expect(request.request.method).toBe('PATCH');
    request.flush({ message: 'Agenda deactivated (logical delete)', agenda: AGENDA });
  });

  it('should delete with DELETE /:id', () => {
    api.remove(1).subscribe();

    const request = http.expectOne(`${BASE}/1`);
    expect(request.request.method).toBe('DELETE');
    request.flush({ message: 'Agenda permanently deleted', id: 1 });
  });
});
