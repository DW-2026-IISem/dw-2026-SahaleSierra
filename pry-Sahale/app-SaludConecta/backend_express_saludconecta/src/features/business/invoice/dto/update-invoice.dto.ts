import { InvoiceState } from "../invoice.model";

/**
 * Datos de entrada de `PUT /api/invoices/:id` (cabecera).
 *
 * `subtotal` y `total` no están aquí: el subtotal viene de las atenciones y el
 * total se recalcula como `subtotal + tax`. Si `tax` no llega en PUT, vale 0.
 */
export interface UpdateInvoiceDto {
  number?: string;
  invoice_date?: Date | string;
  tax?: number;
  state?: InvoiceState;
  status?: "active" | "inactive";
}
