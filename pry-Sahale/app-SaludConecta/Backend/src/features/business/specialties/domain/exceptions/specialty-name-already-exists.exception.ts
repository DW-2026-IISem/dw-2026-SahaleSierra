import { DomainException } from '../../../../../common/exceptions/domain.exception.js';

export class SpecialtyNameAlreadyExistsException extends DomainException {
  constructor(name: string) {
    super(`Ya existe una especialidad con el nombre ${name}`);
  }
}
