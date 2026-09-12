import { Appointment } from '../../../domain/entities/appointment.entity.js';
import { AppointmentMapper } from '../../../application/mappers/appointment.mapper.js';
import { AppointmentResponseDto } from '../../../application/dto/appointment-response.dto.js';

export class AppointmentSerializer {
  static one(entity: Appointment): AppointmentResponseDto {
    return AppointmentMapper.toResponse(entity);
  }

  static many(entities: Appointment[]): AppointmentResponseDto[] {
    return entities.map(AppointmentMapper.toResponse);
  }
}
