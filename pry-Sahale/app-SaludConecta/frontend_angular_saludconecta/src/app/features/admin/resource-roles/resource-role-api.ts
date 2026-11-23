import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  PermissionMatrixPayload,
  ResourceRole,
  ResourceRolePayload,
  RoleGrantReconciliation,
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
  
  /**
   * Guarda la matriz completa del rol: `{ role_id, resource_ids }` → `{ result }`.
   * Lo que no venga en `resource_ids` queda retirado en el backend.
   */
  reconcileRole(role_id: number, resource_ids: number[]): Observable<RoleGrantReconciliation> {
    const payload: PermissionMatrixPayload = { role_id, resource_ids };
    return this.http
      .post<{ message?: string; result?: RoleGrantReconciliation } | null>(this.base, payload)
      .pipe(map((r) => requiredResult(r)));
  }


  deactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/deactivate`, {});
  }

  reactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/reactivate`, {});
  }
}

/** La matriz solo se da por guardada si el backend devolvió `result` con los conteos. */
function requiredResult(
  response: { result?: RoleGrantReconciliation } | null,
): RoleGrantReconciliation {
  const result = response?.result;
  if (!result || typeof result.total_active !== 'number') {
    throw new Error('Respuesta inesperada del backend: falta «result» al guardar la matriz.');
  }
  return result;
}
