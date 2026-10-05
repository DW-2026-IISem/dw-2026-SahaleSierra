import { InvoiceState } from "../invoice.model";

/**
 * Datos de entrada de `POST /api/invoices` — facturar atenciones.
 *
 * `encounter_ids` son las atenciones a agrupar: activas, `completed`, sin
 * factura y del mismo paciente. `subtotal` y `total` no se reciben: se calculan.
 */
export interface CreateInvoiceDto {
  number: string;
  invoice_date?: Date | string;
  tax?: number;
  state?: InvoiceState;
  status?: "active" | "inactive";
  encounter_ids: number[];
}
