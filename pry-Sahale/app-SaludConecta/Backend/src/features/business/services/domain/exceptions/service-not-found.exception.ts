import { EntityNotFoundException } from '../../../../../common/exceptions/entity-not-found.exception.js';

export class ServiceNotFoundException extends EntityNotFoundException {
  constructor(id: number | string) {
    super('Servicio', id);
  }
}
