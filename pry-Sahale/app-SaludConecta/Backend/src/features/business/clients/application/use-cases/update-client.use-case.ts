import { Inject, Injectable } from '@nestjs/common';
import {
  type IPasswordHasher,
  PASSWORD_HASHER,
} from '../../../../../infrastructure/security/hashing/password-hasher.interface.js';
import { ClientEmailAlreadyExistsException } from '../../domain/exceptions/client-email-already-exists.exception.js';
import { ClientNotFoundException } from '../../domain/exceptions/client-not-found.exception.js';
import {
  CLIENT_REPOSITORY,
  type IClientRepository,
} from '../../domain/interfaces/client-repository.interface.js';
import { UpdateClientDto } from '../dto/update-client.dto.js';
import { ClientMapper } from '../mappers/client.mapper.js';

@Injectable()
export class UpdateClientUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: IClientRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  async execute(id: number, dto: UpdateClientDto) {
    const client = await this.clientRepository.findById(id);
    if (!client) {
      throw new ClientNotFoundException(id);
    }

    if (dto.email && dto.email !== client.email) {
      const existing = await this.clientRepository.findByEmail(dto.email);
      if (existing) {
        throw new ClientEmailAlreadyExistsException(dto.email);
      }
    }

    const updateData = { ...dto };
    if (dto.password) {
      updateData.password = await this.passwordHasher.hash(dto.password);
    }

    client.update(updateData);
    const updated = await this.clientRepository.update(client);
    return ClientMapper.toResponse(updated);
  }
}
