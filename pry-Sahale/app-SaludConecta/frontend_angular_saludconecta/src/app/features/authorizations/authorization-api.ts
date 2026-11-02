import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Authorization,
  AuthorizationPayload,
  AuthorizationUpdatePayload,
} from '../../core/models/authorization.model';

/** Autorizaciones: una por cita (`appointment_id` único y fijo). */
@Injectable({ providedIn: 'root' })
export class AuthorizationApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/authorizations`;

  list(): Observable<Authorization[]> {
    return this.http
      .get<{ authorizations: Authorization[] }>(this.base)
      .pipe(map((response) => response.authorizations));
  }

  get(id: number): Observable<Authorization> {
    return this.http
      .get<{ authorization: Authorization }>(`${this.base}/${id}`)
      .pipe(map((response) => response.authorization));
  }

  create(payload: AuthorizationPayload): Observable<Authorization> {
    return this.http
      .post<{ authorization: Authorization }>(this.base, payload)
      .pipe(map((response) => response.authorization));
  }

  update(id: number, payload: AuthorizationUpdatePayload): Observable<Authorization> {
    return this.http
      .patch<{ authorization: Authorization }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.authorization));
  }

  deactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/deactivate`, {});
  }

  remove(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
