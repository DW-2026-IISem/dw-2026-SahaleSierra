import { EntityNotFoundException } from '../../../../../common/exceptions/entity-not-found.exception.js';

export class PatientNotFoundException extends EntityNotFoundException {
  constructor(id: number | string) {
    super('Paciente', id);
  }
}
