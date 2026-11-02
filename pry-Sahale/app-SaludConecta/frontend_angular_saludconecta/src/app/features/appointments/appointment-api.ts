import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Appointment,
  AppointmentPayload,
  AppointmentUpdatePayload,
} from '../../core/models/appointment.model';

/**
 * Citas (transaccional). Reglas que responde el backend: agenda y paciente
 * activos, `end_date > start_date` y sin cruce de horario en la misma agenda.
 */
@Injectable({ providedIn: 'root' })
export class AppointmentApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/appointments`;

  list(): Observable<Appointment[]> {
    return this.http
      .get<{ appointments: Appointment[] }>(this.base)
      .pipe(map((response) => response.appointments));
  }

  get(id: number): Observable<Appointment> {
    return this.http
      .get<{ appointment: Appointment }>(`${this.base}/${id}`)
      .pipe(map((response) => response.appointment));
  }

  create(payload: AppointmentPayload): Observable<Appointment> {
    return this.http
      .post<{ appointment: Appointment }>(this.base, payload)
      .pipe(map((response) => response.appointment));
  }

  /** Cancelar una cita = PATCH { state: 'cancelled' }. Nunca 'attended'. */
  update(id: number, payload: AppointmentUpdatePayload): Observable<Appointment> {
    return this.http
      .patch<{ appointment: Appointment }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.appointment));
  }

  deactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/deactivate`, {});
  }

  remove(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
