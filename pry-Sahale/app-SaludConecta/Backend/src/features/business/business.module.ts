import { Module } from '@nestjs/common';
import { PatientsModule } from './patients/patients.module.js';

@Module({
  imports: [PatientsModule],
  exports: [PatientsModule],
})
export class BusinessModule {}
