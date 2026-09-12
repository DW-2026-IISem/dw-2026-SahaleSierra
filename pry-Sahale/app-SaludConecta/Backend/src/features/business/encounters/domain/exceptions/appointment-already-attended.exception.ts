import { DomainException } from '../../../../../common/exceptions/domain.exception.js';

export class AppointmentAlreadyAttendedException extends DomainException {
  constructor(appointmentId: number) {
    super(`La cita ${appointmentId} ya tiene una atención registrada`);
  }
}
