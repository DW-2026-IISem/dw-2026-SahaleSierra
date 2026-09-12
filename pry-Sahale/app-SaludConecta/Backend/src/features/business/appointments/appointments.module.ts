import { Module } from '@nestjs/common';
import { AppointmentsController } from './presentation/http/controllers/appointments.controller.js';
import { CreateAppointmentUseCase } from './application/use-cases/create-appointment.use-case.js';
import { RescheduleAppointmentUseCase } from './application/use-cases/reschedule-appointment.use-case.js';
import { CancelAppointmentUseCase } from './application/use-cases/cancel-appointment.use-case.js';
import { GetAppointmentUseCase } from './application/use-cases/get-appointment.use-case.js';
import { ListAppointmentsUseCase } from './application/use-cases/list-appointments.use-case.js';
import { DeleteAppointmentUseCase } from './application/use-cases/delete-appointment.use-case.js';
import { SequelizeAppointmentRepository } from './infrastructure/persistence/repositories/appointment.repository.js';
import { APPOINTMENT_REPOSITORY } from './domain/interfaces/appointment-repository.interface.js';
import { PatientsModule } from '../patients/patients.module.js';
import { AgendasModule } from '../agendas/agendas.module.js';

@Module({
  imports: [PatientsModule, AgendasModule],
  controllers: [AppointmentsController],
  providers: [
    CreateAppointmentUseCase,
    RescheduleAppointmentUseCase,
    CancelAppointmentUseCase,
    GetAppointmentUseCase,
    ListAppointmentsUseCase,
    DeleteAppointmentUseCase,
    { provide: APPOINTMENT_REPOSITORY, useClass: SequelizeAppointmentRepository },
  ],
  exports: [APPOINTMENT_REPOSITORY],
})
export class AppointmentsModule {}
