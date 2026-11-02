import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  ResourceRole,
  ResourceRolePayload,
} from '../../../core/models/resource-role.model';

/**
 * /api/resource-roles — la tabla es `resource_roles`, pero la respuesta usa
 * `grants` / `grant`. Cada fila ES un permiso (concesión rol ↔ recurso).
 */
@Injectable({ providedIn: 'root' })
export class ResourceRoleApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/resource-roles`;

  list(filters?: { role_id?: number; resource_id?: number }): Observable<ResourceRole[]> {
    let params = new HttpParams();
    if (filters?.role_id) {
      params = params.set('role_id', filters.role_id);
    }
    if (filters?.resource_id) {
      params = params.set('resource_id', filters.resource_id);
    }
    return this.http
      .get<{ grants: ResourceRole[] }>(this.base, { params })
      .pipe(map((r) => r.grants));
  }

  get(id: number): Observable<ResourceRole> {
    return this.http
      .get<{ grant: ResourceRole }>(`${this.base}/${id}`)
      .pipe(map((r) => r.grant));
  }

  create(payload: ResourceRolePayload): Observable<ResourceRole> {
    return this.http
      .post<{ grant: ResourceRole }>(this.base, payload)
      .pipe(map((r) => r.grant));
  }

  deactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/deactivate`, {});
  }

  reactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/reactivate`, {});
  }
}
