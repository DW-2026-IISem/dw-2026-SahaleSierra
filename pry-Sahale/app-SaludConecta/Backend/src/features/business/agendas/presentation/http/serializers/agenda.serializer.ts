import { Agenda } from '../../../domain/entities/agenda.entity.js';
import { AgendaMapper } from '../../../application/mappers/agenda.mapper.js';
import { AgendaResponseDto } from '../../../application/dto/agenda-response.dto.js';

export class AgendaSerializer {
  static one(entity: Agenda): AgendaResponseDto {
    return AgendaMapper.toResponse(entity);
  }

  static many(entities: Agenda[]): AgendaResponseDto[] {
    return entities.map(AgendaMapper.toResponse);
  }
}
