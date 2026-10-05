import { UpdateInvoiceDto } from "./update-invoice.dto";

/** Datos de entrada de `PATCH /api/invoices/:id` (actualización parcial). */
export type PatchInvoiceDto = Partial<UpdateInvoiceDto>;
