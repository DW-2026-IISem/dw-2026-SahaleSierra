import { Encounter } from '../../../domain/entities/encounter.entity.js';
import { EncounterMapper } from '../../../application/mappers/encounter.mapper.js';
import { EncounterResponseDto } from '../../../application/dto/encounter-response.dto.js';

export class EncounterSerializer {
  static one(entity: Encounter): EncounterResponseDto {
    return EncounterMapper.toResponse(entity);
  }

  static many(entities: Encounter[]): EncounterResponseDto[] {
    return entities.map(EncounterMapper.toResponse);
  }
}
