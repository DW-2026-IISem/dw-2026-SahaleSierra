import { Inject, Injectable } from '@nestjs/common';
import { ClinicalRecord } from '../../domain/entities/clinical-record.entity.js';
import { ClinicalRecordNotFoundException } from '../../domain/exceptions/clinical-record-not-found.exception.js';
import { CLINICAL_RECORD_REPOSITORY } from '../../domain/interfaces/clinical-record-repository.interface.js';
import type { ClinicalRecordRepository } from '../../domain/interfaces/clinical-record-repository.interface.js';
import { UpdateClinicalRecordDto } from '../dto/update-clinical-record.dto.js';

@Injectable()
export class UpdateClinicalRecordUseCase {
  constructor(
    @Inject(CLINICAL_RECORD_REPOSITORY) private readonly clinicalRecordRepository: ClinicalRecordRepository,
  ) {}

  async execute(id: number, dto: UpdateClinicalRecordDto): Promise<ClinicalRecord> {
    const record = await this.clinicalRecordRepository.findById(id);
    if (!record) throw new ClinicalRecordNotFoundException(id);
    record.update({ name: dto.name, description: dto.description });
    return this.clinicalRecordRepository.update(id, record);
  }
}
