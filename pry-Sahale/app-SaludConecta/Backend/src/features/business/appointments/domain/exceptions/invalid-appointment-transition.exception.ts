import { DomainException } from '../../../../../common/exceptions/domain.exception.js';

export class InvalidAppointmentTransitionException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
