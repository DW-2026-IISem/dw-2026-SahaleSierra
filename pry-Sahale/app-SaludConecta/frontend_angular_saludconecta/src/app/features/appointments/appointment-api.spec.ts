import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { Appointment } from '../../core/models/appointment.model';
import { AppointmentApi } from './appointment-api';

const BASE = `${environment.apiUrl}/appointments`;

const APPOINTMENT: Appointment = {
  id: 1,
  agenda_id: 1,
  patient_id: 1,
  start_date: '2026-11-10T14:00:00.000Z',
  end_date: '2026-11-10T14:30:00.000Z',
  reason: 'Control de rutina',
  state: 'scheduled',
  status: 'active',
};

describe('AppointmentApi', () => {
  let api: AppointmentApi;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    api = TestBed.inject(AppointmentApi);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should unwrap { appointments } into Appointment[]', () => {
    let result: Appointment[] | undefined;
    api.list().subscribe((rows) => (result = rows));

    const request = http.expectOne(BASE);
    expect(request.request.method).toBe('GET');
    request.flush({ appointments: [APPOINTMENT] });

    expect(result).toEqual([APPOINTMENT]);
  });

  it('should unwrap { appointment } when getting one by id', () => {
    let result: Appointment | undefined;
    api.get(1).subscribe((row) => (result = row));

    http.expectOne(`${BASE}/1`).flush({ appointment: APPOINTMENT });

    expect(result).toEqual(APPOINTMENT);
  });

  it('should POST the payload without state and unwrap the created appointment', () => {
    const payload = {
      agenda_id: 1,
      patient_id: 1,
      start_date: '2026-11-10T14:00:00.000Z',
      end_date: '2026-11-10T14:30:00.000Z',
      reason: null,
      status: 'active' as const,
    };
    let result: Appointment | undefined;
    api.create(payload).subscribe((row) => (result = row));

    const request = http.expectOne(BASE);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(payload);
    expect('state' in request.request.body).toBe(false);
    request.flush({ appointment: APPOINTMENT });

    expect(result).toEqual(APPOINTMENT);
  });

  it('should cancel an appointment with PATCH { state: "cancelled" }', () => {
    api.update(1, { state: 'cancelled' }).subscribe();

    const request = http.expectOne(`${BASE}/1`);
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual({ state: 'cancelled' });
    request.flush({ appointment: { ...APPOINTMENT, state: 'cancelled' } });
  });

  it('should PATCH only the fields that changed', () => {
    api.update(1, { reason: 'Control prioritario' }).subscribe();

    const request = http.expectOne(`${BASE}/1`);
    expect(request.request.body).toEqual({ reason: 'Control prioritario' });
    expect('status' in request.request.body).toBe(false);
    request.flush({ appointment: APPOINTMENT });
  });

  it('should deactivate with PATCH /:id/deactivate', () => {
    api.deactivate(1).subscribe();

    const request = http.expectOne(`${BASE}/1/deactivate`);
    expect(request.request.method).toBe('PATCH');
    request.flush({ message: 'Appointment deactivated (logical delete)' });
  });

  it('should delete with DELETE /:id', () => {
    api.remove(1).subscribe();

    const request = http.expectOne(`${BASE}/1`);
    expect(request.request.method).toBe('DELETE');
    request.flush({ message: 'Appointment permanently deleted', id: 1 });
  });
});
