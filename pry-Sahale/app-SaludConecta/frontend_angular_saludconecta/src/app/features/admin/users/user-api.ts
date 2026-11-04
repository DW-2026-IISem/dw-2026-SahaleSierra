import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { UpdatePayload } from '../../../core/models/api.model';
import { EffectivePermission } from '../../../core/models/auth.model';
import { ChangePasswordPayload, User, UserPayload } from '../../../core/models/user.model';
/** PATCH /api/users/:id solo acepta username, email y avatar. */
export type UserPatchPayload = Partial<Pick<UserPayload, 'username' | 'email' | 'avatar'>>;
/** /api/users — JWT + RBAC. No hay ruta para reactivar usuarios. */
@Injectable({ providedIn: 'root' })
export class UserApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/users`;

  list(): Observable<User[]> {
    return this.http.get<{ users: User[] }>(this.base).pipe(map((r) => r.users));
  }

  get(id: number): Observable<User> {
    return this.http.get<{ user: User }>(`${this.base}/${id}`).pipe(map((r) => r.user));
  }

  /** Duplicado de username o email → 409 (`Username already in use`). */
  create(payload: UserPayload): Observable<User> {
    return this.http.post<{ user: User }>(this.base, payload).pipe(map((r) => r.user));
  }

   update(id: number, payload: UserPatchPayload): Observable<User> {
    return this.http
      .patch<{ user: User }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.user));
  }

  /** PATCH /api/users/:id/password */
  changePassword(id: number, payload: ChangePasswordPayload): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/password`, payload);
  }

  /** GET /api/users/:id/permissions → { permissions } */
  permissions(id: number): Observable<EffectivePermission[]> {
    return this.http
      .get<{ permissions: EffectivePermission[] }>(`${this.base}/${id}/permissions`)
      .pipe(map((r) => r.permissions));
  }

  deactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/deactivate`, {});
  }

  remove(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
