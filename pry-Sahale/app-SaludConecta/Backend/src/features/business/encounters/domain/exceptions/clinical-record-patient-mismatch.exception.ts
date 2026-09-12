import { DomainException } from '../../../../../common/exceptions/domain.exception.js';

export class ClinicalRecordPatientMismatchException extends DomainException {
  constructor() {
    super('La historia clínica no pertenece al paciente de la cita');
  }
}
