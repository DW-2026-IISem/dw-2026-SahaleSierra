import { DomainException } from '../../../../../common/exceptions/domain.exception.js';

export class PatientAlreadyHasClinicalRecordException extends DomainException {
  constructor(patientId: number) {
    super(`El paciente ${patientId} ya tiene una historia clínica registrada`);
  }
}
