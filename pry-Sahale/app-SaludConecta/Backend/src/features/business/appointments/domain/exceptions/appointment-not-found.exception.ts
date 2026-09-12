import { EntityNotFoundException } from '../../../../../common/exceptions/entity-not-found.exception.js';

export class AppointmentNotFoundException extends EntityNotFoundException {
  constructor(id: number | string) {
    super('Cita', id);
  }
}
