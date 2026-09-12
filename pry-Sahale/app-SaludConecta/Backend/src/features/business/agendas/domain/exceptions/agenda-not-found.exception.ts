import { EntityNotFoundException } from '../../../../../common/exceptions/entity-not-found.exception.js';

export class AgendaNotFoundException extends EntityNotFoundException {
  constructor(id: number | string) {
    super('Agenda', id);
  }
}
