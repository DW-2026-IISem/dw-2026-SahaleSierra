import { Module } from '@nestjs/common';
import { DoctorsController } from './presentation/http/controllers/doctors.controller.js';
import { CreateDoctorUseCase } from './application/use-cases/create-doctor.use-case.js';
import { DeleteDoctorUseCase } from './application/use-cases/delete-doctor.use-case.js';
import { GetDoctorUseCase } from './application/use-cases/get-doctor.use-case.js';
import { ListDoctorsUseCase } from './application/use-cases/list-doctors.use-case.js';
import { UpdateDoctorUseCase } from './application/use-cases/update-doctor.use-case.js';
import { SequelizeDoctorRepository } from './infrastructure/persistence/repositories/doctor.repository.js';
import { DOCTOR_REPOSITORY } from './domain/interfaces/doctor-repository.interface.js';

@Module({
  controllers: [DoctorsController],
  providers: [
    CreateDoctorUseCase,
    DeleteDoctorUseCase,
    GetDoctorUseCase,
    ListDoctorsUseCase,
    UpdateDoctorUseCase,
    { provide: DOCTOR_REPOSITORY, useClass: SequelizeDoctorRepository },
  ],
  exports: [DOCTOR_REPOSITORY],
})
export class DoctorsModule {}
