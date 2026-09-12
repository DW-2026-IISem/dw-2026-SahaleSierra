import { Appointment } from '../../domain/entities/appointment.entity.js';
import { AppointmentModel } from '../../infrastructure/persistence/models/appointment.model.js';
import { AppointmentResponseDto } from '../dto/appointment-response.dto.js';

export class AppointmentMapper {
  static toDomain(model: AppointmentModel): Appointment {
    return Appointment.reconstitute({
      id: model.id,
      patientId: model.patientId,
      agendaId: model.agendaId,
      startDate: model.startDate,
      endDate: model.endDate,
      reason: model.reason,
      status: model.status as Appointment['status'],
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toPersistence(entity: Appointment): Partial<AppointmentModel> {
    return {
      patientId: entity.patientId,
      agendaId: entity.agendaId,
      startDate: entity.startDate,
      endDate: entity.endDate,
      reason: entity.reason,
      status: entity.status,
    } as Partial<AppointmentModel>;
  }

  static toResponse(entity: Appointment): AppointmentResponseDto {
    return {
      id: entity.id!,
      patientId: entity.patientId,
      agendaId: entity.agendaId,
      startDate: entity.startDate,
      endDate: entity.endDate,
      reason: entity.reason,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
