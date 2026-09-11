import { DomainException } from '../../../../../common/exceptions/domain.exception.js';

export class PatientDocumentAlreadyExistsException extends DomainException {
  constructor(documentNumber: string) {
    super(`Ya existe un paciente con el número de documento ${documentNumber}`);
  }
}
