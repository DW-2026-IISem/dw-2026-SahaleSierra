import { EntityNotFoundException } from '../../../../../common/exceptions/entity-not-found.exception.js';

export class ProductTypeNotFoundException extends EntityNotFoundException {
  constructor(id: number) {
    super('Tipo de producto', id);
  }
}
