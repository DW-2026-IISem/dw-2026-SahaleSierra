import { Inject, Injectable } from '@nestjs/common';
import { Appointment } from '../../domain/entities/appointment.entity.js';
import { APPOINTMENT_REPOSITORY } from '../../domain/interfaces/appointment-repository.interface.js';
import type { AppointmentFilter, AppointmentRepository } from '../../domain/interfaces/appointment-repository.interface.js';
import type { PaginationParams } from '../../../../../common/interfaces/pagination.interface.js';

@Injectable()
export class ListAppointmentsUseCase {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY) private readonly appointmentRepository: AppointmentRepository,
  ) {}

  async execute(
    filter: AppointmentFilter,
    pagination: PaginationParams,
  ): Promise<{ data: Appointment[]; total: number }> {
    return this.appointmentRepository.findAll(filter, pagination);
  }
}
