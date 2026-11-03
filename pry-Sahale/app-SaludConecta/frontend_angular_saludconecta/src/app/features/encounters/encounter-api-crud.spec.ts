import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { Encounter } from '../../core/models/encounter.model';
import { EncounterApi } from './encounter-api';

const BASE = `${environment.apiUrl}/encounters`;

const ENCOUNTER: Encounter = {
  id: 1,
  appointment_id: 1,
  clinical_record_id: 1,
  service_id: 1,
  start_date: '2026-11-10T14:00:00.000Z',
  end_date: '2026-11-10T14:30:00.000Z',
  total: '85000.00',
  state: 'completed',
  observations: null,
  invoice_id: null,
  status: 'active',
};

describe('EncounterApi (list, get, update, deactivate, remove)', () => {
  let api: EncounterApi;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    api = TestBed.inject(EncounterApi);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should unwrap { encounters } into Encounter[]', () => {
    let result: Encounter[] | undefined;
    api.list().subscribe((rows) => (result = rows));

    const request = http.expectOne(BASE);
    expect(request.request.method).toBe('GET');
    request.flush({ encounters: [ENCOUNTER] });

    expect(result).toEqual([ENCOUNTER]);
  });

  it('should unwrap { encounter } when getting one by id', () => {
    let result: Encounter | undefined;
    api.get(1).subscribe((row) => (result = row));

    http.expectOne(`${BASE}/1`).flush({ encounter: ENCOUNTER });

    expect(result).toEqual(ENCOUNTER);
  });

  it('should PATCH only the sent fields and never the appointment_id', () => {
    api.update(1, { state: 'completed', observations: 'Control en 15 días' }).subscribe();

    const request = http.expectOne(`${BASE}/1`);
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual({ state: 'completed', observations: 'Control en 15 días' });
    expect('appointment_id' in request.request.body).toBe(false);
    request.flush({ encounter: ENCOUNTER });
  });

  it('should deactivate with PATCH /:id/deactivate', () => {
    api.deactivate(1).subscribe();

    const request = http.expectOne(`${BASE}/1/deactivate`);
    expect(request.request.method).toBe('PATCH');
    request.flush({ message: 'Encounter deactivated (logical delete)' });
  });

  it('should delete with DELETE /:id', () => {
    api.remove(1).subscribe();

    const request = http.expectOne(`${BASE}/1`);
    expect(request.request.method).toBe('DELETE');
    request.flush({ message: 'Encounter permanently deleted', id: 1 });
  });
});
