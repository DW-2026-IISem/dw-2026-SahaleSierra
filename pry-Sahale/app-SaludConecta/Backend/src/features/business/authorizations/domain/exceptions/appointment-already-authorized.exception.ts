import { DomainException } from '../../../../../common/exceptions/domain.exception.js';

export class AppointmentAlreadyAuthorizedException extends DomainException {
  constructor(appointmentId: number) {
    super(`La cita ${appointmentId} ya tiene una autorización registrada`);
  }
}
