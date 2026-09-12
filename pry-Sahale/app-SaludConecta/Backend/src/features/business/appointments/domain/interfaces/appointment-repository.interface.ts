import { Appointment } from '../entities/appointment.entity.js';
import type { PaginationParams } from '../../../../../common/interfaces/pagination.interface.js';

export interface AppointmentFilter {
  patientId?: number;
  agendaId?: number;
  status?: string;
}

export const APPOINTMENT_REPOSITORY = 'APPOINTMENT_REPOSITORY';

export interface AppointmentRepository {
  create(appointment: Appointment): Promise<Appointment>;
  findById(id: number): Promise<Appointment | null>;
  findAll(
    filter: AppointmentFilter,
    pagination: PaginationParams,
  ): Promise<{ data: Appointment[]; total: number }>;
  update(id: number, appointment: Appointment): Promise<Appointment>;
  delete(id: number): Promise<void>;
}
