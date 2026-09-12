import { Inject, Injectable } from '@nestjs/common';
import { ClinicalRecord } from '../../domain/entities/clinical-record.entity.js';
import { CLINICAL_RECORD_REPOSITORY } from '../../domain/interfaces/clinical-record-repository.interface.js';
import type { ClinicalRecordFilter, ClinicalRecordRepository } from '../../domain/interfaces/clinical-record-repository.interface.js';
import type { PaginationParams } from '../../../../../common/interfaces/pagination.interface.js';

@Injectable()
export class ListClinicalRecordsUseCase {
  constructor(
    @Inject(CLINICAL_RECORD_REPOSITORY) private readonly clinicalRecordRepository: ClinicalRecordRepository,
  ) {}

  async execute(
    filter: ClinicalRecordFilter,
    pagination: PaginationParams,
  ): Promise<{ data: ClinicalRecord[]; total: number }> {
    return this.clinicalRecordRepository.findAll(filter, pagination);
  }
}
