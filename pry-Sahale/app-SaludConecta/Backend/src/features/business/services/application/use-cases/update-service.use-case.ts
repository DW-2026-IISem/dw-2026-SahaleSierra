import { Inject, Injectable } from '@nestjs/common';
import { Service } from '../../domain/entities/service.entity.js';
import { ServiceNotFoundException } from '../../domain/exceptions/service-not-found.exception.js';
import { SERVICE_REPOSITORY } from '../../domain/interfaces/service-repository.interface.js';
import type { ServiceRepository } from '../../domain/interfaces/service-repository.interface.js';
import { UpdateServiceDto } from '../dto/update-service.dto.js';

@Injectable()
export class UpdateServiceUseCase {
  constructor(@Inject(SERVICE_REPOSITORY) private readonly serviceRepository: ServiceRepository) {}

  async execute(id: number, dto: UpdateServiceDto): Promise<Service> {
    const service = await this.serviceRepository.findById(id);
    if (!service) throw new ServiceNotFoundException(id);
    service.update({ name: dto.name, description: dto.description });
    return this.serviceRepository.update(id, service);
  }
}
