import { Inject, Injectable } from '@nestjs/common';
import { Authorization } from '../../domain/entities/authorization.entity.js';
import { AUTHORIZATION_REPOSITORY } from '../../domain/interfaces/authorization-repository.interface.js';
import type { AuthorizationFilter, AuthorizationRepository } from '../../domain/interfaces/authorization-repository.interface.js';
import type { PaginationParams } from '../../../../../common/interfaces/pagination.interface.js';

@Injectable()
export class ListAuthorizationsUseCase {
  constructor(
    @Inject(AUTHORIZATION_REPOSITORY) private readonly authorizationRepository: AuthorizationRepository,
  ) {}

  async execute(
    filter: AuthorizationFilter,
    pagination: PaginationParams,
  ): Promise<{ data: Authorization[]; total: number }> {
    return this.authorizationRepository.findAll(filter, pagination);
  }
}
