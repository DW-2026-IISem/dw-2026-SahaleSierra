import { Encounter } from './encounter.model';
import { Money, Status, Timestamps } from './api.model';

export type InvoiceState = 'issued' | 'paid' | 'cancelled';

/** Tabla `invoices` — /api/invoices. Agrupa atenciones. */
export interface Invoice extends Timestamps {
  id: number;
  number: string; // único, ej. 'FV-100001'
  invoice_date: string;
  subtotal: Money;
  tax: Money;
  total: Money;
  state: InvoiceState;
  status: Status;
  encounters?: Encounter[];
}

/**
 * Crear: NO se envían `subtotal` ni `total`; los calcula el backend
 * (subtotal = suma de los `total` de las atenciones; total = subtotal + tax).
 * Las atenciones deben estar activas, `completed`, sin factura y del mismo paciente.
 */
export interface InvoiceCreatePayload {
  number: string;
  encounter_ids: number[];
  invoice_date?: string;
  tax?: number; // por defecto 0
  state?: InvoiceState; // por defecto 'issued'
  status?: Status;
}

export interface InvoiceUpdatePayload {
  number?: string;
  tax?: number;
  state?: InvoiceState;
  invoice_date?: string;
}
