import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { Appointment } from '../../core/models/appointment.model';
import { Encounter } from '../../core/models/encounter.model';
import { EncounterApi } from './encounter-api';

describe('EncounterApi', () => {
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

  it('should return the encounter and the appointment now in attended state', () => {
    const encounter = { id: 1, appointment_id: 20, total: '85000.00', invoice_id: null } as Encounter;
    const appointment = { id: 20, state: 'attended' } as Appointment;
    let result: { encounter: Encounter; appointment: Appointment } | undefined;

    api.create({ appointment_id: 20, service_id: 1, total: 85000, state: 'completed' })
      .subscribe((r) => (result = r));

    const request = http.expectOne(`${environment.apiUrl}/encounters`);
    expect(request.request.method).toBe('POST');
    request.flush({ encounter, appointment });

    expect(result?.appointment.state).toBe('attended');
    expect(result?.encounter.id).toBe(1);
  });
});
