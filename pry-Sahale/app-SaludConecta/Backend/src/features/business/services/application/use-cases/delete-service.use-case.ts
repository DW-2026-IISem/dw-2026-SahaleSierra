import { Inject, Injectable } from '@nestjs/common';
import { ServiceNotFoundException } from '../../domain/exceptions/service-not-found.exception.js';
import { SERVICE_REPOSITORY } from '../../domain/interfaces/service-repository.interface.js';
import type { ServiceRepository } from '../../domain/interfaces/service-repository.interface.js';

@Injectable()
export class DeleteServiceUseCase {
  constructor(@Inject(SERVICE_REPOSITORY) private readonly serviceRepository: ServiceRepository) {}

  async execute(id: number): Promise<void> {
    const service = await this.serviceRepository.findById(id);
    if (!service) throw new ServiceNotFoundException(id);
    await this.serviceRepository.delete(id);
  }
}
