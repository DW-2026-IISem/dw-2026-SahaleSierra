import { Inject, Injectable } from '@nestjs/common';
import { Service } from '../../domain/entities/service.entity.js';
import { SERVICE_REPOSITORY } from '../../domain/interfaces/service-repository.interface.js';
import type { ServiceFilter, ServiceRepository } from '../../domain/interfaces/service-repository.interface.js';
import type { PaginationParams } from '../../../../../common/interfaces/pagination.interface.js';

@Injectable()
export class ListServicesUseCase {
  constructor(@Inject(SERVICE_REPOSITORY) private readonly serviceRepository: ServiceRepository) {}

  async execute(filter: ServiceFilter, pagination: PaginationParams): Promise<{ data: Service[]; total: number }> {
    return this.serviceRepository.findAll(filter, pagination);
  }
}
