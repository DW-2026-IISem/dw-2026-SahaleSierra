import { Invoice, InvoiceI } from "../invoice.model";
import { EncounterI } from "../../encounter/encounter.model";

/**
 * Respuesta HTTP de una factura.
 *
 * Incluye las atenciones agrupadas (`encounters`) en las lecturas, el alta y
 * las actualizaciones; el borrado lógico devuelve solo la cabecera.
 */
export interface InvoiceResponseDto extends InvoiceI {
  encounters?: EncounterI[];
}

/** Mapper modelo -> DTO de respuesta (objeto plano, con atenciones si vienen). */
export function toInvoiceResponse(invoice: Invoice): InvoiceResponseDto {
  return invoice.toJSON() as InvoiceResponseDto;
}
