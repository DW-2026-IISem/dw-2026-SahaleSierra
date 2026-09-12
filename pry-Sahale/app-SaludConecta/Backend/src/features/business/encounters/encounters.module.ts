import { Module } from '@nestjs/common';
import { EncountersController } from './presentation/http/controllers/encounters.controller.js';
import { CreateEncounterUseCase } from './application/use-cases/create-encounter.use-case.js';
import { DeleteEncounterUseCase } from './application/use-cases/delete-encounter.use-case.js';
import { GetEncounterUseCase } from './application/use-cases/get-encounter.use-case.js';
import { ListEncountersUseCase } from './application/use-cases/list-encounters.use-case.js';
import { UpdateEncounterUseCase } from './application/use-cases/update-encounter.use-case.js';
import { SequelizeEncounterRepository } from './infrastructure/persistence/repositories/encounter.repository.js';
import { ENCOUNTER_REPOSITORY } from './domain/interfaces/encounter-repository.interface.js';
import { AppointmentsModule } from '../appointments/appointments.module.js';
import { ServicesModule } from '../services/services.module.js';
import { ClinicalRecordsModule } from '../clinical-records/clinical-records.module.js';

@Module({
  imports: [AppointmentsModule, ServicesModule, ClinicalRecordsModule],
  controllers: [EncountersController],
  providers: [
    CreateEncounterUseCase,
    DeleteEncounterUseCase,
    GetEncounterUseCase,
    ListEncountersUseCase,
    UpdateEncounterUseCase,
    { provide: ENCOUNTER_REPOSITORY, useClass: SequelizeEncounterRepository },
  ],
  exports: [ENCOUNTER_REPOSITORY],
})
export class EncountersModule {}
