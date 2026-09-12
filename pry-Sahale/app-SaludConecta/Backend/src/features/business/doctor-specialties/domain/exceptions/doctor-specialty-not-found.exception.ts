import { EntityNotFoundException } from '../../../../../common/exceptions/entity-not-found.exception.js';

export class DoctorSpecialtyNotFoundException extends EntityNotFoundException {
  constructor(id: number | string) {
    super('Relación médico-especialidad', id);
  }
}
