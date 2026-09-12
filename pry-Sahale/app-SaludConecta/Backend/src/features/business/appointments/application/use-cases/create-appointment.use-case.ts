import { Inject, Injectable } from '@nestjs/common';
import { Appointment } from '../../domain/entities/appointment.entity.js';
import { APPOINTMENT_REPOSITORY } from '../../domain/interfaces/appointment-repository.interface.js';
import type { AppointmentRepository } from '../../domain/interfaces/appointment-repository.interface.js';
import { PATIENT_REPOSITORY } from '../../../patients/domain/interfaces/patient-repository.interface.js';
import type { PatientRepository } from '../../../patients/domain/interfaces/patient-repository.interface.js';
import { PatientNotFoundException } from '../../../patients/domain/exceptions/patient-not-found.exception.js';
import { AGENDA_REPOSITORY } from '../../../agendas/domain/interfaces/agenda-repository.interface.js';
import type { AgendaRepository } from '../../../agendas/domain/interfaces/agenda-repository.interface.js';
import { AgendaNotFoundException } from '../../../agendas/domain/exceptions/agenda-not-found.exception.js';
import { CreateAppointmentDto } from '../dto/create-appointment.dto.js';

@Injectable()
export class CreateAppointmentUseCase {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY) private readonly appointmentRepository: AppointmentRepository,
    @Inject(PATIENT_REPOSITORY) private readonly patientRepository: PatientRepository,
    @Inject(AGENDA_REPOSITORY) private readonly agendaRepository: AgendaRepository,
  ) {}

  async execute(dto: CreateAppointmentDto): Promise<Appointment> {
    const patient = await this.patientRepository.findById(dto.patientId);
    if (!patient) throw new PatientNotFoundException(dto.patientId);

    const agenda = await this.agendaRepository.findById(dto.agendaId);
    if (!agenda) throw new AgendaNotFoundException(dto.agendaId);

    const appointment = Appointment.create({
      patientId: dto.patientId,
      agendaId: dto.agendaId,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
      reason: dto.reason,
    });

    return this.appointmentRepository.create(appointment);
  }
}
