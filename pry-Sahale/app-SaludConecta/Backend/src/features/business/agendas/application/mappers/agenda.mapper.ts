import { Agenda } from '../../domain/entities/agenda.entity.js';
import { AgendaModel } from '../../infrastructure/persistence/models/agenda.model.js';
import { AgendaResponseDto } from '../dto/agenda-response.dto.js';

export class AgendaMapper {
  static toDomain(model: AgendaModel): Agenda {
    return Agenda.reconstitute({
      id: model.id,
      doctorId: model.doctorId,
      name: model.name,
      description: model.description,
      status: model.status as Agenda['status'],
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toPersistence(entity: Agenda): Partial<AgendaModel> {
    return {
      doctorId: entity.doctorId,
      name: entity.name,
      description: entity.description,
      status: entity.status,
    } as Partial<AgendaModel>;
  }

  static toResponse(entity: Agenda): AgendaResponseDto {
    return {
      id: entity.id!,
      doctorId: entity.doctorId,
      name: entity.name,
      description: entity.description,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
