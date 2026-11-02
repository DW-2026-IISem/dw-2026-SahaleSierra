import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UpdatePayload } from '../../core/models/api.model';
import { Service, ServicePayload } from '../../core/models/service.model';

/** Servicios médicos (catálogo). No confundir con un servicio de Angular. */
@Injectable({ providedIn: 'root' })
export class ServiceApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/services`;

  list(): Observable<Service[]> {
    return this.http
      .get<{ services: Service[] }>(this.base)
      .pipe(map((response) => response.services));
  }

  get(id: number): Observable<Service> {
    return this.http
      .get<{ service: Service }>(`${this.base}/${id}`)
      .pipe(map((response) => response.service));
  }

  create(payload: ServicePayload): Observable<Service> {
    return this.http
      .post<{ service: Service }>(this.base, payload)
      .pipe(map((response) => response.service));
  }

  update(id: number, payload: UpdatePayload<ServicePayload>): Observable<Service> {
    return this.http
      .patch<{ service: Service }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.service));
  }

  replace(id: number, payload: Omit<ServicePayload, 'status'>): Observable<Service> {
    return this.http
      .put<{ service: Service }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.service));
  }

  deactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/deactivate`, {});
  }

  remove(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
