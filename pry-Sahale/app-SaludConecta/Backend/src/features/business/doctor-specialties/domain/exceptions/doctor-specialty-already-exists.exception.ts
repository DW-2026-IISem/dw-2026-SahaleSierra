import { DomainException } from '../../../../../common/exceptions/domain.exception.js';

export class DoctorSpecialtyAlreadyExistsException extends DomainException {
  constructor(doctorId: number, specialtyId: number) {
    super(`El médico ${doctorId} ya tiene asignada la especialidad ${specialtyId}`);
  }
}
