import { Module } from '@nestjs/common';
import { PatientsModule } from './patients/patients.module.js';
import { SpecialtiesModule } from './specialties/specialties.module.js';
import { DoctorsModule } from './doctors/doctors.module.js';
import { DoctorSpecialtiesModule } from './doctor-specialties/doctor-specialties.module.js';
import { ServicesModule } from './services/services.module.js';

@Module({
  imports: [PatientsModule, SpecialtiesModule, DoctorsModule, DoctorSpecialtiesModule, ServicesModule],
  exports: [PatientsModule, SpecialtiesModule, DoctorsModule, DoctorSpecialtiesModule, ServicesModule],
})
export class BusinessModule {}
