import { Inject, Injectable } from '@nestjs/common';
import { ClinicalRecord } from '../../domain/entities/clinical-record.entity.js';
import { PatientAlreadyHasClinicalRecordException } from '../../domain/exceptions/patient-already-has-clinical-record.exception.js';
import { CLINICAL_RECORD_REPOSITORY } from '../../domain/interfaces/clinical-record-repository.interface.js';
import type { ClinicalRecordRepository } from '../../domain/interfaces/clinical-record-repository.interface.js';
import { PATIENT_REPOSITORY } from '../../../patients/domain/interfaces/patient-repository.interface.js';
import type { PatientRepository } from '../../../patients/domain/interfaces/patient-repository.interface.js';
import { PatientNotFoundException } from '../../../patients/domain/exceptions/patient-not-found.exception.js';
import { CreateClinicalRecordDto } from '../dto/create-clinical-record.dto.js';

@Injectable()
export class CreateClinicalRecordUseCase {
  constructor(
    @Inject(CLINICAL_RECORD_REPOSITORY) private readonly clinicalRecordRepository: ClinicalRecordRepository,
    @Inject(PATIENT_REPOSITORY) private readonly patientRepository: PatientRepository,
  ) {}

  async execute(dto: CreateClinicalRecordDto): Promise<ClinicalRecord> {
    const patient = await this.patientRepository.findById(dto.patientId);
    if (!patient) throw new PatientNotFoundException(dto.patientId);

    const existing = await this.clinicalRecordRepository.findByPatientId(dto.patientId);
    if (existing) throw new PatientAlreadyHasClinicalRecordException(dto.patientId);

    const record = ClinicalRecord.create({
      patientId: dto.patientId,
      name: dto.name,
      description: dto.description,
    });

    return this.clinicalRecordRepository.create(record);
  }
}
