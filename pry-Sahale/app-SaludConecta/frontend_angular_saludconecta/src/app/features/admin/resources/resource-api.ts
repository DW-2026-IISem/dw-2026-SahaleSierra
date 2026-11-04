import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { UpdatePayload } from '../../../core/models/api.model';
import { Resource, ResourcePayload } from '../../../core/models/resource.model';
/** PUT /api/resources/:id — reemplazo completo. */
export type ResourceReplacePayload = Omit<ResourcePayload, 'status'>;
/** /api/resources — JWT + RBAC. Duplicado (method, path) → 409. */
@Injectable({ providedIn: 'root' })
export class ResourceApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/resources`;

  list(): Observable<Resource[]> {
    return this.http.get<{ resources: Resource[] }>(this.base).pipe(map((r) => r.resources));
  }

  get(id: number): Observable<Resource> {
    return this.http
      .get<{ resource: Resource }>(`${this.base}/${id}`)
      .pipe(map((r) => r.resource));
  }

  create(payload: ResourcePayload): Observable<Resource> {
    return this.http
      .post<{ resource: Resource }>(this.base, payload)
      .pipe(map((r) => r.resource));
  }

  update(id: number, payload: UpdatePayload<ResourcePayload>): Observable<Resource> {
    return this.http
      .patch<{ resource: Resource }>(`${this.base}/${id}`, payload)
      .pipe(map((r) => r.resource));
  }

  replace(id: number, payload: ResourceReplacePayload): Observable<Resource> {
    return this.http
      .put<{ resource: Resource }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.resource));
  }
  
  deactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/deactivate`, {});
  }

  remove(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
