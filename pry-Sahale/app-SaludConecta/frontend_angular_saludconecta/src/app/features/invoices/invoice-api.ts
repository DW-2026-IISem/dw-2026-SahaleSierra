import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Encounter } from '../../core/models/encounter.model';
import {
  Invoice,
  InvoiceCreatePayload,
  InvoiceUpdatePayload,
} from '../../core/models/invoice.model';

/** Facturas: agrupan atenciones `completed` sin factura del mismo paciente. */
@Injectable({ providedIn: 'root' })
export class InvoiceApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/invoices`;

  list(): Observable<Invoice[]> {
    return this.http
      .get<{ invoices: Invoice[] }>(this.base)
      .pipe(map((response) => response.invoices));
  }

  get(id: number): Observable<Invoice> {
    return this.http
      .get<{ invoice: Invoice }>(`${this.base}/${id}`)
      .pipe(map((response) => response.invoice));
  }

  /**
   * El backend calcula subtotal y total. Acepta que las atenciones vengan dentro
   * de `invoice.encounters` o al lado (`encounters`): el resultado siempre las
   * deja en `invoice.encounters` (se confirma con el `curl` de 2.3).
   */
  create(payload: InvoiceCreatePayload): Observable<Invoice> {
    return this.http
      .post<{ invoice: Invoice; encounters?: Encounter[] }>(this.base, payload)
      .pipe(
        map((response) => ({
          ...response.invoice,
          encounters: response.invoice.encounters ?? response.encounters,
        })),
      );
  }

  update(id: number, payload: InvoiceUpdatePayload): Observable<Invoice> {
    return this.http
      .patch<{ invoice: Invoice }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.invoice));
  }

  deactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/deactivate`, {});
  }

  remove(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
