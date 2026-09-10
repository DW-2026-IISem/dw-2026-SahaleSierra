import { Inject, Injectable } from '@nestjs/common';
import { ClientNotFoundException } from '../../domain/exceptions/client-not-found.exception.js';
import {
  CLIENT_REPOSITORY,
  type IClientRepository,
} from '../../domain/interfaces/client-repository.interface.js';

@Injectable()
export class DeleteClientUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: IClientRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const client = await this.clientRepository.findById(id);
    if (!client) {
      throw new ClientNotFoundException(id);
    }

    await this.clientRepository.delete(id);
  }
}
