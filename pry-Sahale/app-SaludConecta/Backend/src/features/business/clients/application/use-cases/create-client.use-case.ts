import { Inject, Injectable } from '@nestjs/common';
import {
  type IPasswordHasher,
  PASSWORD_HASHER,
} from '../../../../../infrastructure/security/hashing/password-hasher.interface.js';
import { ClientEmailAlreadyExistsException } from '../../domain/exceptions/client-email-already-exists.exception.js';
import { Client } from '../../domain/entities/client.entity.js';
import {
  CLIENT_REPOSITORY,
  type IClientRepository,
} from '../../domain/interfaces/client-repository.interface.js';
import { CreateClientDto } from '../dto/create-client.dto.js';
import { ClientMapper } from '../mappers/client.mapper.js';

@Injectable()
export class CreateClientUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: IClientRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  async execute(dto: CreateClientDto) {
    if (dto.email) {
      const existing = await this.clientRepository.findByEmail(dto.email);
      if (existing) {
        throw new ClientEmailAlreadyExistsException(dto.email);
      }
    }

    let password = dto.password;
    if (password) {
      password = await this.passwordHasher.hash(password);
    }

    const client = Client.create({
      name: dto.name,
      address: dto.address,
      phone: dto.phone,
      email: dto.email,
      password,
    });

    const created = await this.clientRepository.create(client);
    return ClientMapper.toResponse(created);
  }
}
