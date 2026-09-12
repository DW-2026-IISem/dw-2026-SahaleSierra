import { Module } from '@nestjs/common';
import { AuthorizationsController } from './presentation/http/controllers/authorizations.controller.js';
import { CreateAuthorizationUseCase } from './application/use-cases/create-authorization.use-case.js';
import { DeleteAuthorizationUseCase } from './application/use-cases/delete-authorization.use-case.js';
import { GetAuthorizationUseCase } from './application/use-cases/get-authorization.use-case.js';
import { ListAuthorizationsUseCase } from './application/use-cases/list-authorizations.use-case.js';
import { UpdateAuthorizationUseCase } from './application/use-cases/update-authorization.use-case.js';
import { SequelizeAuthorizationRepository } from './infrastructure/persistence/repositories/authorization.repository.js';
import { AUTHORIZATION_REPOSITORY } from './domain/interfaces/authorization-repository.interface.js';
import { AppointmentsModule } from '../appointments/appointments.module.js';

@Module({
  imports: [AppointmentsModule],
  controllers: [AuthorizationsController],
  providers: [
    CreateAuthorizationUseCase,
    DeleteAuthorizationUseCase,
    GetAuthorizationUseCase,
    ListAuthorizationsUseCase,
    UpdateAuthorizationUseCase,
    { provide: AUTHORIZATION_REPOSITORY, useClass: SequelizeAuthorizationRepository },
  ],
  exports: [AUTHORIZATION_REPOSITORY],
})
export class AuthorizationsModule {}
