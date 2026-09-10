import { DomainException } from '../../../../../common/exceptions/domain.exception.js';

export class SupplierEmailAlreadyExistsException extends DomainException {
  constructor(email: string) {
    super(`El email '${email}' ya está registrado para otro proveedor`);
  }
}
