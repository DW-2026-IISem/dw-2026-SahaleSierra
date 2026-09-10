import { Inject, Injectable } from '@nestjs/common';
import {
  CLIENT_REPOSITORY,
  type IClientRepository,
} from '../../domain/interfaces/client-repository.interface.js';
import { ClientFilterDto } from '../dto/client-filter.dto.js';
import { ClientMapper } from '../mappers/client.mapper.js';

@Injectable()
export class ListClientsUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: IClientRepository,
  ) {}

  async execute(filter: ClientFilterDto) {
    const result = await this.clientRepository.findAll(filter);
    return {
      items: result.items.map((client) => ClientMapper.toResponse(client)),
      meta: result.meta,
    };
  }
}
