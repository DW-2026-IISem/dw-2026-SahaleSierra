import { Module } from '@nestjs/common';
import { AgendasController } from './presentation/http/controllers/agendas.controller.js';
import { CreateAgendaUseCase } from './application/use-cases/create-agenda.use-case.js';
import { DeleteAgendaUseCase } from './application/use-cases/delete-agenda.use-case.js';
import { GetAgendaUseCase } from './application/use-cases/get-agenda.use-case.js';
import { ListAgendasUseCase } from './application/use-cases/list-agendas.use-case.js';
import { UpdateAgendaUseCase } from './application/use-cases/update-agenda.use-case.js';
import { SequelizeAgendaRepository } from './infrastructure/persistence/repositories/agenda.repository.js';
import { AGENDA_REPOSITORY } from './domain/interfaces/agenda-repository.interface.js';
import { DoctorsModule } from '../doctors/doctors.module.js';

@Module({
  imports: [DoctorsModule],
  controllers: [AgendasController],
  providers: [
    CreateAgendaUseCase,
    DeleteAgendaUseCase,
    GetAgendaUseCase,
    ListAgendasUseCase,
    UpdateAgendaUseCase,
    { provide: AGENDA_REPOSITORY, useClass: SequelizeAgendaRepository },
  ],
  exports: [AGENDA_REPOSITORY],
})
export class AgendasModule {}
