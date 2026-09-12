import { Module } from '@nestjs/common';
import { SpecialtiesController } from './presentation/http/controllers/specialties.controller.js';
import { CreateSpecialtyUseCase } from './application/use-cases/create-specialty.use-case.js';
import { DeleteSpecialtyUseCase } from './application/use-cases/delete-specialty.use-case.js';
import { GetSpecialtyUseCase } from './application/use-cases/get-specialty.use-case.js';
import { ListSpecialtiesUseCase } from './application/use-cases/list-specialties.use-case.js';
import { UpdateSpecialtyUseCase } from './application/use-cases/update-specialty.use-case.js';
import { SequelizeSpecialtyRepository } from './infrastructure/persistence/repositories/specialty.repository.js';
import { SPECIALTY_REPOSITORY } from './domain/interfaces/specialty-repository.interface.js';

@Module({
  controllers: [SpecialtiesController],
  providers: [
    CreateSpecialtyUseCase,
    DeleteSpecialtyUseCase,
    GetSpecialtyUseCase,
    ListSpecialtiesUseCase,
    UpdateSpecialtyUseCase,
    { provide: SPECIALTY_REPOSITORY, useClass: SequelizeSpecialtyRepository },
  ],
  exports: [SPECIALTY_REPOSITORY],
})
export class SpecialtiesModule {}
