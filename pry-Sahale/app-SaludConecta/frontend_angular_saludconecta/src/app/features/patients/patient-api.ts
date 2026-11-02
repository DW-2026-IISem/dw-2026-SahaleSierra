import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UpdatePayload } from '../../core/models/api.model';
import { Patient, PatientPayload } from '../../core/models/patient.model';

/** Contrato exacto de `features/business/patient` en Express. */
@Injectable({ providedIn: 'root' })
export class PatientApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/patients`;

  /** Solo devuelve pacientes `active`: un paciente dado de baja desaparece de la lista. */
  list(): Observable<Patient[]> {
    return this.http
      .get<{ patients: Patient[] }>(this.base)
      .pipe(map((response) => response.patients));
  }

  get(id: number): Observable<Patient> {
    return this.http
      .get<{ patient: Patient }>(`${this.base}/${id}`)
      .pipe(map((response) => response.patient));
  }

  create(payload: PatientPayload): Observable<Patient> {
    return this.http
      .post<{ patient: Patient }>(this.base, payload)
      .pipe(map((response) => response.patient));
  }

  /** PATCH /api/patients/:id — actualización parcial (la que usa el formulario). */
  update(id: number, payload: UpdatePayload<PatientPayload>): Observable<Patient> {
    return this.http
      .patch<{ patient: Patient }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.patient));
  }

  /** PUT /api/patients/:id — reemplazo completo. */
  replace(id: number, payload: Omit<PatientPayload, 'status'>): Observable<Patient> {
    return this.http
      .put<{ patient: Patient }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.patient));
  }

  /** Baja lógica: status = inactive. */
  deactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/deactivate`, {});
  }

  /** Baja física: DELETE. */
  remove(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
