import { DomainException } from '../../../../../common/exceptions/domain.exception.js';

export class InvalidProductStockException extends DomainException {
  constructor(stock: number) {
    super(`El stock '${stock}' no puede ser negativo`);
  }
}
