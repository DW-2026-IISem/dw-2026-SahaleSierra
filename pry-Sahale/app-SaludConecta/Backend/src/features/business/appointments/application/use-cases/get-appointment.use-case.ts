import { Inject, Injectable } from '@nestjs/common';
import { Appointment } from '../../domain/entities/appointment.entity.js';
import { AppointmentNotFoundException } from '../../domain/exceptions/appointment-not-found.exception.js';
import { APPOINTMENT_REPOSITORY } from '../../domain/interfaces/appointment-repository.interface.js';
import type { AppointmentRepository } from '../../domain/interfaces/appointment-repository.interface.js';

@Injectable()
export class GetAppointmentUseCase {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY) private readonly appointmentRepository: AppointmentRepository,
  ) {}

  async execute(id: number): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findById(id);
    if (!appointment) throw new AppointmentNotFoundException(id);
    return appointment;
  }
}
