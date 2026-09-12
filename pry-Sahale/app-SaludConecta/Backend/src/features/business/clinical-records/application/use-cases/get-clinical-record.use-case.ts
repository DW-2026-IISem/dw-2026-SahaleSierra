import { Inject, Injectable } from '@nestjs/common';
import { ClinicalRecord } from '../../domain/entities/clinical-record.entity.js';
import { ClinicalRecordNotFoundException } from '../../domain/exceptions/clinical-record-not-found.exception.js';
import { CLINICAL_RECORD_REPOSITORY } from '../../domain/interfaces/clinical-record-repository.interface.js';
import type { ClinicalRecordRepository } from '../../domain/interfaces/clinical-record-repository.interface.js';

@Injectable()
export class GetClinicalRecordUseCase {
  constructor(
    @Inject(CLINICAL_RECORD_REPOSITORY) private readonly clinicalRecordRepository: ClinicalRecordRepository,
  ) {}

  async execute(id: number): Promise<ClinicalRecord> {
    const record = await this.clinicalRecordRepository.findById(id);
    if (!record) throw new ClinicalRecordNotFoundException(id);
    return record;
  }
}
