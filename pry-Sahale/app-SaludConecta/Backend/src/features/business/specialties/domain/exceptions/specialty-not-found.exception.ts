import { EntityNotFoundException } from '../../../../../common/exceptions/entity-not-found.exception.js';

export class SpecialtyNotFoundException extends EntityNotFoundException {
  constructor(id: number | string) {
    super('Especialidad', id);
  }
}
