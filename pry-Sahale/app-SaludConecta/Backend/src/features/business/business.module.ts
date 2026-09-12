import { Module } from '@nestjs/common';
import { PatientsModule } from './patients/patients.module.js';
import { SpecialtiesModule } from './specialties/specialties.module.js';

@Module({
  imports: [PatientsModule, SpecialtiesModule],
  exports: [PatientsModule, SpecialtiesModule],
})
export class BusinessModule {}
