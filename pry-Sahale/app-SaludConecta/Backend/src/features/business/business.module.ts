import { Module } from '@nestjs/common';
import { PatientsModule } from './patients/patients.module.js';
import { SpecialtiesModule } from './specialties/specialties.module.js';
import { DoctorsModule } from './doctors/doctors.module.js';
import { DoctorSpecialtiesModule } from './doctor-specialties/doctor-specialties.module.js';
import { ServicesModule } from './services/services.module.js';
import { AgendasModule } from './agendas/agendas.module.js';
import { AppointmentsModule } from './appointments/appointments.module.js';
import { AuthorizationsModule } from './authorizations/authorizations.module.js';
import { ClinicalRecordsModule } from './clinical-records/clinical-records.module.js';
import { EncountersModule } from './encounters/encounters.module.js';

@Module({
  imports: [
    PatientsModule,
    SpecialtiesModule,
    DoctorsModule,
    DoctorSpecialtiesModule,
    ServicesModule,
    AgendasModule,
    AppointmentsModule,
    AuthorizationsModule,
    ClinicalRecordsModule,
    EncountersModule,
  ],
  exports: [
    PatientsModule,
    SpecialtiesModule,
    DoctorsModule,
    DoctorSpecialtiesModule,
    ServicesModule,
    AgendasModule,
    AppointmentsModule,
    AuthorizationsModule,
    ClinicalRecordsModule,
    EncountersModule,
  ],
})
export class BusinessModule {}
