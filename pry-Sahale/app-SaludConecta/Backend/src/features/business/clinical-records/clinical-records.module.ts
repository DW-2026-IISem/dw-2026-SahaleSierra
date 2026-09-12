import { Module } from '@nestjs/common';
import { ClinicalRecordsController } from './presentation/http/controllers/clinical-records.controller.js';
import { CreateClinicalRecordUseCase } from './application/use-cases/create-clinical-record.use-case.js';
import { DeleteClinicalRecordUseCase } from './application/use-cases/delete-clinical-record.use-case.js';
import { GetClinicalRecordUseCase } from './application/use-cases/get-clinical-record.use-case.js';
import { GetClinicalRecordByPatientUseCase } from './application/use-cases/get-clinical-record-by-patient.use-case.js';
import { ListClinicalRecordsUseCase } from './application/use-cases/list-clinical-records.use-case.js';
import { UpdateClinicalRecordUseCase } from './application/use-cases/update-clinical-record.use-case.js';
import { SequelizeClinicalRecordRepository } from './infrastructure/persistence/repositories/clinical-record.repository.js';
import { CLINICAL_RECORD_REPOSITORY } from './domain/interfaces/clinical-record-repository.interface.js';
import { PatientsModule } from '../patients/patients.module.js';

@Module({
  imports: [PatientsModule],
  controllers: [ClinicalRecordsController],
  providers: [
    CreateClinicalRecordUseCase,
    DeleteClinicalRecordUseCase,
    GetClinicalRecordUseCase,
    GetClinicalRecordByPatientUseCase,
    ListClinicalRecordsUseCase,
    UpdateClinicalRecordUseCase,
    { provide: CLINICAL_RECORD_REPOSITORY, useClass: SequelizeClinicalRecordRepository },
  ],
  exports: [CLINICAL_RECORD_REPOSITORY],
})
export class ClinicalRecordsModule {}
