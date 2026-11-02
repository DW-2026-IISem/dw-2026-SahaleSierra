import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Encounter,
  EncounterCreateResult,
  EncounterPayload,
  EncounterUpdatePayload,
} from '../../core/models/encounter.model';

/** Atenciones. Una atención facturada no se puede borrar ni cambiar su `total`. */
@Injectable({ providedIn: 'root' })
export class EncounterApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/encounters`;

  list(): Observable<Encounter[]> {
    return this.http
      .get<{ encounters: Encounter[] }>(this.base)
      .pipe(map((response) => response.encounters));
  }

  get(id: number): Observable<Encounter> {
    return this.http
      .get<{ encounter: Encounter }>(`${this.base}/${id}`)
      .pipe(map((response) => response.encounter));
  }

  /**
   * POST devuelve la atención y la cita, que en la misma transacción pasó a
   * `attended`. La UI muestra ese cambio, por eso se devuelven las dos.
   */
  create(payload: EncounterPayload): Observable<EncounterCreateResult> {
    return this.http
      .post<{ encounter: Encounter; appointment: EncounterCreateResult['appointment'] }>(
        this.base,
        payload,
      )
      .pipe(map((response) => ({ encounter: response.encounter, appointment: response.appointment })));
  }

  update(id: number, payload: EncounterUpdatePayload): Observable<Encounter> {
    return this.http
      .patch<{ encounter: Encounter }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.encounter));
  }

  deactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/deactivate`, {});
  }

  remove(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
