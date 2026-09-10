import { EntityNotFoundException } from '../../../../../common/exceptions/entity-not-found.exception.js';

export class ClientNotFoundException extends EntityNotFoundException {
  constructor(id: number) {
    super('Cliente', id);
  }
}
