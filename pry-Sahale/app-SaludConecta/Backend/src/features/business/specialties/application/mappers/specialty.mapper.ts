import { Specialty } from '../../domain/entities/specialty.entity.js';
import { SpecialtyModel } from '../../infrastructure/persistence/models/specialty.model.js';
import { SpecialtyResponseDto } from '../dto/specialty-response.dto.js';

export class SpecialtyMapper {
  static toDomain(model: SpecialtyModel): Specialty {
    return Specialty.reconstitute({
      id: model.id,
      name: model.name,
      description: model.description,
      status: model.status as Specialty['status'],
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toPersistence(entity: Specialty): Partial<SpecialtyModel> {
    return {
      name: entity.name,
      description: entity.description,
      status: entity.status,
    } as Partial<SpecialtyModel>;
  }

  static toResponse(entity: Specialty): SpecialtyResponseDto {
    return {
      id: entity.id!,
      name: entity.name,
      description: entity.description,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
