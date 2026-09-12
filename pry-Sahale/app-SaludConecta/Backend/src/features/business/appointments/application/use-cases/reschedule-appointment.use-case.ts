import { Inject, Injectable } from '@nestjs/common';
import { Appointment } from '../../domain/entities/appointment.entity.js';
import { AppointmentNotFoundException } from '../../domain/exceptions/appointment-not-found.exception.js';
import { APPOINTMENT_REPOSITORY } from '../../domain/interfaces/appointment-repository.interface.js';
import type { AppointmentRepository } from '../../domain/interfaces/appointment-repository.interface.js';
import { RescheduleAppointmentDto } from '../dto/reschedule-appointment.dto.js';

@Injectable()
export class RescheduleAppointmentUseCase {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY) private readonly appointmentRepository: AppointmentRepository,
  ) {}

  async execute(id: number, dto: RescheduleAppointmentDto): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findById(id);
    if (!appointment) throw new AppointmentNotFoundException(id);

    appointment.reschedule(
      dto.startDate ? new Date(dto.startDate) : undefined,
      dto.endDate ? new Date(dto.endDate) : undefined,
      dto.reason,
    );

    return this.appointmentRepository.update(id, appointment);
  }
}
