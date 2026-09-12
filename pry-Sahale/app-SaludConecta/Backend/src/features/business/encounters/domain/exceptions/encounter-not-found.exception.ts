import { EntityNotFoundException } from '../../../../../common/exceptions/entity-not-found.exception.js';

export class EncounterNotFoundException extends EntityNotFoundException {
  constructor(id: number | string) {
    super('Atención', id);
  }
}
