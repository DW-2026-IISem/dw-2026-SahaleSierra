import { EntityNotFoundException } from '../../../../../common/exceptions/entity-not-found.exception.js';

export class ClinicalRecordNotFoundException extends EntityNotFoundException {
  constructor(id: number | string) {
    super('Historia clínica', id);
  }
}
