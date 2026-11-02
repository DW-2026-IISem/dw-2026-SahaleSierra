import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UpdatePayload } from '../../core/models/api.model';
import { Doctor, DoctorPayload } from '../../core/models/doctor.model';

@Injectable({ providedIn: 'root' })
export class DoctorApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/doctors`;

  list(): Observable<Doctor[]> {
    return this.http
      .get<{ doctors: Doctor[] }>(this.base)
      .pipe(map((response) => response.doctors));
  }

  get(id: number): Observable<Doctor> {
    return this.http
      .get<{ doctor: Doctor }>(`${this.base}/${id}`)
      .pipe(map((response) => response.doctor));
  }

  create(payload: DoctorPayload): Observable<Doctor> {
    return this.http
      .post<{ doctor: Doctor }>(this.base, payload)
      .pipe(map((response) => response.doctor));
  }

  update(id: number, payload: UpdatePayload<DoctorPayload>): Observable<Doctor> {
    return this.http
      .patch<{ doctor: Doctor }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.doctor));
  }

  replace(id: number, payload: Omit<DoctorPayload, 'status'>): Observable<Doctor> {
    return this.http
      .put<{ doctor: Doctor }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.doctor));
  }

  deactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/deactivate`, {});
  }

  remove(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
