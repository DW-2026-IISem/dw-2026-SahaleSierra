import { Inject, Injectable } from '@nestjs/common';
import { AppointmentNotFoundException } from '../../domain/exceptions/appointment-not-found.exception.js';
import { APPOINTMENT_REPOSITORY } from '../../domain/interfaces/appointment-repository.interface.js';
import type { AppointmentRepository } from '../../domain/interfaces/appointment-repository.interface.js';

@Injectable()
export class DeleteAppointmentUseCase {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY) private readonly appointmentRepository: AppointmentRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const appointment = await this.appointmentRepository.findById(id);
    if (!appointment) throw new AppointmentNotFoundException(id);
    await this.appointmentRepository.delete(id);
  }
}
