import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { UpdatePayload } from '../../../core/models/api.model';
import { Role, RolePayload } from '../../../core/models/role.model';
/** PUT /api/roles/:id — reemplazo completo. */
export type RoleReplacePayload = Omit<RolePayload, 'status'>;
/** /api/roles — JWT + RBAC. */
@Injectable({ providedIn: 'root' })
export class RoleApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/roles`;

  list(): Observable<Role[]> {
    return this.http.get<{ roles: Role[] }>(this.base).pipe(map((r) => r.roles));
  }

  get(id: number): Observable<Role> {
    return this.http.get<{ role: Role }>(`${this.base}/${id}`).pipe(map((r) => r.role));
  }

  create(payload: RolePayload): Observable<Role> {
    return this.http.post<{ role: Role }>(this.base, payload).pipe(map((r) => r.role));
  }

  update(id: number, payload: UpdatePayload<RolePayload>): Observable<Role> {
    return this.http
      .patch<{ role: Role }>(`${this.base}/${id}`, payload)
      .pipe(map((r) => r.role));
  }

  replace(id: number, payload: RoleReplacePayload): Observable<Role> {
    return this.http
      .put<{ role: Role }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.role));
  }
  
  deactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/deactivate`, {});
  }

  remove(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
