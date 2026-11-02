import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { RoleUser, RoleUserPayload } from '../../../core/models/role-user.model';

/**
 * /api/role-users — la tabla es `role_users`, pero la respuesta usa
 * `assignments` / `assignment`, no `role_users`. Cinco rutas.
 */
@Injectable({ providedIn: 'root' })
export class RoleUserApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/role-users`;

  list(): Observable<RoleUser[]> {
    return this.http
      .get<{ assignments: RoleUser[] }>(this.base)
      .pipe(map((r) => r.assignments));
  }

  get(id: number): Observable<RoleUser> {
    return this.http
      .get<{ assignment: RoleUser }>(`${this.base}/${id}`)
      .pipe(map((r) => r.assignment));
  }

  create(payload: RoleUserPayload): Observable<RoleUser> {
    return this.http
      .post<{ assignment: RoleUser }>(this.base, payload)
      .pipe(map((r) => r.assignment));
  }

  deactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/deactivate`, {});
  }

  reactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/reactivate`, {});
  }
}
