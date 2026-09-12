import { DomainException } from '../../../../../common/exceptions/domain.exception.js';

export class EncounterAlreadyInvoicedException extends DomainException {
  constructor(encounterId: number) {
    super(`La atención ${encounterId} ya está incluida en otra factura`);
  }
}
