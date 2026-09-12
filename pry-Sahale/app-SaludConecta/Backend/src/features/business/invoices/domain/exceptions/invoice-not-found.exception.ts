import { EntityNotFoundException } from '../../../../../common/exceptions/entity-not-found.exception.js';

export class InvoiceNotFoundException extends EntityNotFoundException {
  constructor(id: number | string) {
    super('Factura', id);
  }
}
