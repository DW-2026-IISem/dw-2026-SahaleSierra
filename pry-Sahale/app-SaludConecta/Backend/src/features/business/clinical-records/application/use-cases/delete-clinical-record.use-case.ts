import { Inject, Injectable } from '@nestjs/common';
import { ClinicalRecordNotFoundException } from '../../domain/exceptions/clinical-record-not-found.exception.js';
import { CLINICAL_RECORD_REPOSITORY } from '../../domain/interfaces/clinical-record-repository.interface.js';
import type { ClinicalRecordRepository } from '../../domain/interfaces/clinical-record-repository.interface.js';

@Injectable()
export class DeleteClinicalRecordUseCase {
  constructor(
    @Inject(CLINICAL_RECORD_REPOSITORY) private readonly clinicalRecordRepository: ClinicalRecordRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const record = await this.clinicalRecordRepository.findById(id);
    if (!record) throw new ClinicalRecordNotFoundException(id);
    await this.clinicalRecordRepository.delete(id);
  }
}
