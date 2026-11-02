import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UpdatePayload } from '../../core/models/api.model';
import { Agenda, AgendaPayload } from '../../core/models/agenda.model';

/** Agenda de un médico (FK `doctor_id`): el médico debe existir y estar activo. */
@Injectable({ providedIn: 'root' })
export class AgendaApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/agendas`;

  list(): Observable<Agenda[]> {
    return this.http
      .get<{ agendas: Agenda[] }>(this.base)
      .pipe(map((response) => response.agendas));
  }

  get(id: number): Observable<Agenda> {
    return this.http
      .get<{ agenda: Agenda }>(`${this.base}/${id}`)
      .pipe(map((response) => response.agenda));
  }

  create(payload: AgendaPayload): Observable<Agenda> {
    return this.http
      .post<{ agenda: Agenda }>(this.base, payload)
      .pipe(map((response) => response.agenda));
  }

  update(id: number, payload: UpdatePayload<AgendaPayload>): Observable<Agenda> {
    return this.http
      .patch<{ agenda: Agenda }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.agenda));
  }

  replace(id: number, payload: Omit<AgendaPayload, 'status'>): Observable<Agenda> {
    return this.http
      .put<{ agenda: Agenda }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.agenda));
  }

  deactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/deactivate`, {});
  }

  remove(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
