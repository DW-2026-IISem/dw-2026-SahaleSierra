import { Service } from '../../domain/entities/service.entity.js';
import { ServiceModel } from '../../infrastructure/persistence/models/service.model.js';
import { ServiceResponseDto } from '../dto/service-response.dto.js';

export class ServiceMapper {
  static toDomain(model: ServiceModel): Service {
    return Service.reconstitute({
      id: model.id,
      name: model.name,
      description: model.description,
      status: model.status as Service['status'],
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toPersistence(entity: Service): Partial<ServiceModel> {
    return {
      name: entity.name,
      description: entity.description,
      status: entity.status,
    } as Partial<ServiceModel>;
  }

  static toResponse(entity: Service): ServiceResponseDto {
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
