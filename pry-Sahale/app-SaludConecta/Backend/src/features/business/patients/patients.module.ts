import { Module } from '@nestjs/common';
import { PatientsController } from './presentation/http/controllers/patients.controller.js';
import { CreatePatientUseCase } from './application/use-cases/create-patient.use-case.js';
import { DeletePatientUseCase } from './application/use-cases/delete-patient.use-case.js';
import { GetPatientUseCase } from './application/use-cases/get-patient.use-case.js';
import { ListPatientsUseCase } from './application/use-cases/list-patients.use-case.js';
import { UpdatePatientUseCase } from './application/use-cases/update-patient.use-case.js';
import { SequelizePatientRepository } from './infrastructure/persistence/repositories/patient.repository.js';
import { PATIENT_REPOSITORY } from './domain/interfaces/patient-repository.interface.js';

@Module({
  controllers: [PatientsController],
  providers: [
    CreatePatientUseCase,
    DeletePatientUseCase,
    GetPatientUseCase,
    ListPatientsUseCase,
    UpdatePatientUseCase,
    { provide: PATIENT_REPOSITORY, useClass: SequelizePatientRepository },
  ],
  exports: [PATIENT_REPOSITORY],
})
export class PatientsModule {}
