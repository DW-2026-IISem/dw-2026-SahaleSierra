import { EntityNotFoundException } from '../../../../../common/exceptions/entity-not-found.exception.js';

export class DoctorNotFoundException extends EntityNotFoundException {
  constructor(id: number | string) {
    super('Médico', id);
  }
}
