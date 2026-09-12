import { Inject, Injectable } from '@nestjs/common';
import { AuthorizationNotFoundException } from '../../domain/exceptions/authorization-not-found.exception.js';
import { AUTHORIZATION_REPOSITORY } from '../../domain/interfaces/authorization-repository.interface.js';
import type { AuthorizationRepository } from '../../domain/interfaces/authorization-repository.interface.js';

@Injectable()
export class DeleteAuthorizationUseCase {
  constructor(
    @Inject(AUTHORIZATION_REPOSITORY) private readonly authorizationRepository: AuthorizationRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const authorization = await this.authorizationRepository.findById(id);
    if (!authorization) throw new AuthorizationNotFoundException(id);
    await this.authorizationRepository.delete(id);
  }
}
