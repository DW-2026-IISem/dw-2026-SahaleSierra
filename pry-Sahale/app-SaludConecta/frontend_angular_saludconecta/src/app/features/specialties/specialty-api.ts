import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UpdatePayload } from '../../core/models/api.model';
import { Specialty, SpecialtyPayload } from '../../core/models/specialty.model';

@Injectable({ providedIn: 'root' })
export class SpecialtyApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/specialties`;

  list(): Observable<Specialty[]> {
    return this.http
      .get<{ specialties: Specialty[] }>(this.base)
      .pipe(map((response) => response.specialties));
  }

  get(id: number): Observable<Specialty> {
    return this.http
      .get<{ specialty: Specialty }>(`${this.base}/${id}`)
      .pipe(map((response) => response.specialty));
  }

  create(payload: SpecialtyPayload): Observable<Specialty> {
    return this.http
      .post<{ specialty: Specialty }>(this.base, payload)
      .pipe(map((response) => response.specialty));
  }

  update(id: number, payload: UpdatePayload<SpecialtyPayload>): Observable<Specialty> {
    return this.http
      .patch<{ specialty: Specialty }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.specialty));
  }

  replace(id: number, payload: Omit<SpecialtyPayload, 'status'>): Observable<Specialty> {
    return this.http
      .put<{ specialty: Specialty }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.specialty));
  }

  deactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/deactivate`, {});
  }

  remove(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
