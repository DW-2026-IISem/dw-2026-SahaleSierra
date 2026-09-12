import { Module } from '@nestjs/common';
import { ServicesController } from './presentation/http/controllers/services.controller.js';
import { CreateServiceUseCase } from './application/use-cases/create-service.use-case.js';
import { DeleteServiceUseCase } from './application/use-cases/delete-service.use-case.js';
import { GetServiceUseCase } from './application/use-cases/get-service.use-case.js';
import { ListServicesUseCase } from './application/use-cases/list-services.use-case.js';
import { UpdateServiceUseCase } from './application/use-cases/update-service.use-case.js';
import { SequelizeServiceRepository } from './infrastructure/persistence/repositories/service.repository.js';
import { SERVICE_REPOSITORY } from './domain/interfaces/service-repository.interface.js';

@Module({
  controllers: [ServicesController],
  providers: [
    CreateServiceUseCase,
    DeleteServiceUseCase,
    GetServiceUseCase,
    ListServicesUseCase,
    UpdateServiceUseCase,
    { provide: SERVICE_REPOSITORY, useClass: SequelizeServiceRepository },
  ],
  exports: [SERVICE_REPOSITORY],
})
export class ServicesModule {}
