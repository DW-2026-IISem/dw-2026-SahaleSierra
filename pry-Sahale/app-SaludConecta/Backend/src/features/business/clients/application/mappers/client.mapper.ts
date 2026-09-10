import { Status } from '../../../../../common/enums/status.enum.js';
import { Client } from '../../domain/entities/client.entity.js';
import { ClientResponseDto } from '../dto/client-response.dto.js';
import { ClientModel } from '../../infrastructure/persistence/models/client.model.js';

export class ClientMapper {
  static toDomain(model: ClientModel): Client {
    return Client.reconstitute({
      id: model.id,
      name: model.name,
      address: model.address ?? undefined,
      phone: model.phone ?? undefined,
      email: model.email ?? undefined,
      password: model.password ?? undefined,
      status: model.status,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toResponse(entity: Client): ClientResponseDto {
    return {
      id: entity.id!,
      name: entity.name,
      address: entity.address,
      phone: entity.phone,
      email: entity.email,
      status: entity.status,
      createdAt: entity.createdAt!,
      updatedAt: entity.updatedAt!,
    };
  }

  static toPersistence(entity: Client): Partial<ClientModel> {
    return {
      id: entity.id,
      name: entity.name,
      address: entity.address ?? null,
      phone: entity.phone ?? null,
      email: entity.email ?? null,
      password: entity.password ?? null,
      status: entity.status ?? Status.ACTIVE,
    };
  }
}
