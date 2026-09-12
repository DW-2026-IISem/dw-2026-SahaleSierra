import { DomainException } from '../../../../../common/exceptions/domain.exception.js';

export class ServiceNameAlreadyExistsException extends DomainException {
  constructor(name: string) {
    super(`Ya existe un servicio con el nombre ${name}`);
  }
}
