import { Module } from '@nestjs/common';
import { DoctorSpecialtiesController } from './presentation/http/controllers/doctor-specialties.controller.js';
import { CreateDoctorSpecialtyUseCase } from './application/use-cases/create-doctor-specialty.use-case.js';
import { DeleteDoctorSpecialtyUseCase } from './application/use-cases/delete-doctor-specialty.use-case.js';
import { ListDoctorSpecialtiesUseCase } from './application/use-cases/list-doctor-specialties.use-case.js';
import { SequelizeDoctorSpecialtyRepository } from './infrastructure/persistence/repositories/doctor-specialty.repository.js';
import { DOCTOR_SPECIALTY_REPOSITORY } from './domain/interfaces/doctor-specialty-repository.interface.js';
import { DoctorsModule } from '../doctors/doctors.module.js';
import { SpecialtiesModule } from '../specialties/specialties.module.js';

@Module({
  imports: [DoctorsModule, SpecialtiesModule],
  controllers: [DoctorSpecialtiesController],
  providers: [
    CreateDoctorSpecialtyUseCase,
    DeleteDoctorSpecialtyUseCase,
    ListDoctorSpecialtiesUseCase,
    { provide: DOCTOR_SPECIALTY_REPOSITORY, useClass: SequelizeDoctorSpecialtyRepository },
  ],
  exports: [DOCTOR_SPECIALTY_REPOSITORY],
})
export class DoctorSpecialtiesModule {}
