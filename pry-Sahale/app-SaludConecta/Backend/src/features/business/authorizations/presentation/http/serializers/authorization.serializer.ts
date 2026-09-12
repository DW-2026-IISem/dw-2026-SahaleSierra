import { Authorization } from '../../../domain/entities/authorization.entity.js';
import { AuthorizationMapper } from '../../../application/mappers/authorization.mapper.js';
import { AuthorizationResponseDto } from '../../../application/dto/authorization-response.dto.js';

export class AuthorizationSerializer {
  static one(entity: Authorization): AuthorizationResponseDto {
    return AuthorizationMapper.toResponse(entity);
  }

  static many(entities: Authorization[]): AuthorizationResponseDto[] {
    return entities.map(AuthorizationMapper.toResponse);
  }
}
