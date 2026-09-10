import { Client } from '../../../domain/entities/client.entity.js';
import { ClientResponseDto } from '../../../application/dto/client-response.dto.js';
import { ClientMapper } from '../../../application/mappers/client.mapper.js';

export class ClientSerializer {
  static serialize(entity: Client): ClientResponseDto {
    return ClientMapper.toResponse(entity);
  }
}
