import { ApplicationException } from './application.exception.js';

export class DomainException extends ApplicationException {
  constructor(message: string) {
    super(message, 400);
  }
}
