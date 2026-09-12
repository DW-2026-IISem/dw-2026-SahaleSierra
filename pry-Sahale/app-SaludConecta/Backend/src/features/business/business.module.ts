import { Module } from '@nestjs/common';
import { PatientsModule } from './patients/patients.module.js';
import { SpecialtiesModule } from './specialties/specialties.module.js';
import { DoctorsModule } from './doctors/doctors.module.js';

@Module({
  imports: [PatientsModule, SpecialtiesModule, DoctorsModule],
  exports: [PatientsModule, SpecialtiesModule, DoctorsModule],
})
export class BusinessModule {}
