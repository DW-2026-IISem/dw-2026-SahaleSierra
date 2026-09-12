import { Authorization } from '../../domain/entities/authorization.entity.js';
import { AuthorizationModel } from '../../infrastructure/persistence/models/authorization.model.js';
import { AuthorizationResponseDto } from '../dto/authorization-response.dto.js';

export class AuthorizationMapper {
  static toDomain(model: AuthorizationModel): Authorization {
    return Authorization.reconstitute({
      id: model.id,
      appointmentId: model.appointmentId,
      name: model.name,
      description: model.description,
      status: model.status as Authorization['status'],
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toPersistence(entity: Authorization): Partial<AuthorizationModel> {
    return {
      appointmentId: entity.appointmentId,
      name: entity.name,
      description: entity.description,
      status: entity.status,
    } as Partial<AuthorizationModel>;
  }

  static toResponse(entity: Authorization): AuthorizationResponseDto {
    return {
      id: entity.id!,
      appointmentId: entity.appointmentId,
      name: entity.name,
      description: entity.description,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
