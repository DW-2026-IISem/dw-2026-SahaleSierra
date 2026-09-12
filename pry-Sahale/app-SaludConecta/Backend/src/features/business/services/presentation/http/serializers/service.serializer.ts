import { Service } from '../../../domain/entities/service.entity.js';
import { ServiceMapper } from '../../../application/mappers/service.mapper.js';
import { ServiceResponseDto } from '../../../application/dto/service-response.dto.js';

export class ServiceSerializer {
  static one(entity: Service): ServiceResponseDto {
    return ServiceMapper.toResponse(entity);
  }

  static many(entities: Service[]): ServiceResponseDto[] {
    return entities.map(ServiceMapper.toResponse);
  }
}
