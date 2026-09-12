import { Inject, Injectable } from '@nestjs/common';
import { Authorization } from '../../domain/entities/authorization.entity.js';
import { AuthorizationNotFoundException } from '../../domain/exceptions/authorization-not-found.exception.js';
import { AUTHORIZATION_REPOSITORY } from '../../domain/interfaces/authorization-repository.interface.js';
import type { AuthorizationRepository } from '../../domain/interfaces/authorization-repository.interface.js';

@Injectable()
export class GetAuthorizationUseCase {
  constructor(
    @Inject(AUTHORIZATION_REPOSITORY) private readonly authorizationRepository: AuthorizationRepository,
  ) {}

  async execute(id: number): Promise<Authorization> {
    const authorization = await this.authorizationRepository.findById(id);
    if (!authorization) throw new AuthorizationNotFoundException(id);
    return authorization;
  }
}
