import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UpdatePayload } from '../../core/models/api.model';
import {
  DoctorSpecialty,
  DoctorSpecialtyPayload,
} from '../../core/models/doctor-specialty.model';

/**
 * Pivote N:M médico ↔ especialidad. El par (doctor_id, specialty_id) es único:
 * repetirlo responde `400 Doctor already has this specialty (id N)`.
 */
@Injectable({ providedIn: 'root' })
export class DoctorSpecialtyApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/doctor-specialties`;

  list(): Observable<DoctorSpecialty[]> {
    return this.http
      .get<{ doctor_specialties: DoctorSpecialty[] }>(this.base)
      .pipe(map((response) => response.doctor_specialties));
  }

  get(id: number): Observable<DoctorSpecialty> {
    return this.http
      .get<{ doctor_specialty: DoctorSpecialty }>(`${this.base}/${id}`)
      .pipe(map((response) => response.doctor_specialty));
  }

  create(payload: DoctorSpecialtyPayload): Observable<DoctorSpecialty> {
    return this.http
      .post<{ doctor_specialty: DoctorSpecialty }>(this.base, payload)
      .pipe(map((response) => response.doctor_specialty));
  }

  update(
    id: number,
    payload: UpdatePayload<DoctorSpecialtyPayload>,
  ): Observable<DoctorSpecialty> {
    return this.http
      .patch<{ doctor_specialty: DoctorSpecialty }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.doctor_specialty));
  }

  deactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/deactivate`, {});
  }

  remove(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
