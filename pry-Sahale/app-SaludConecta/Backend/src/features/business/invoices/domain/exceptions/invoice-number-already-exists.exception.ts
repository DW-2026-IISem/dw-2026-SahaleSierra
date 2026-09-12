import { DomainException } from '../../../../../common/exceptions/domain.exception.js';

export class InvoiceNumberAlreadyExistsException extends DomainException {
  constructor(number: string) {
    super(`Ya existe una factura con el número ${number}`);
  }
}
