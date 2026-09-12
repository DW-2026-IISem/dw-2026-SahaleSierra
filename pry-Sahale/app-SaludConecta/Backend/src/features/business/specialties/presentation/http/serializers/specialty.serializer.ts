import { Specialty } from '../../../domain/entities/specialty.entity.js';
import { SpecialtyMapper } from '../../../application/mappers/specialty.mapper.js';
import { SpecialtyResponseDto } from '../../../application/dto/specialty-response.dto.js';

export class SpecialtySerializer {
  static one(entity: Specialty): SpecialtyResponseDto {
    return SpecialtyMapper.toResponse(entity);
  }

  static many(entities: Specialty[]): SpecialtyResponseDto[] {
    return entities.map(SpecialtyMapper.toResponse);
  }
}
