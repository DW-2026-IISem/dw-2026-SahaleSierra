import { Inject, Injectable } from '@nestjs/common';
import { Service } from '../../domain/entities/service.entity.js';
import { ServiceNameAlreadyExistsException } from '../../domain/exceptions/service-name-already-exists.exception.js';
import { SERVICE_REPOSITORY } from '../../domain/interfaces/service-repository.interface.js';
import type { ServiceRepository } from '../../domain/interfaces/service-repository.interface.js';
import { CreateServiceDto } from '../dto/create-service.dto.js';

@Injectable()
export class CreateServiceUseCase {
  constructor(@Inject(SERVICE_REPOSITORY) private readonly serviceRepository: ServiceRepository) {}

  async execute(dto: CreateServiceDto): Promise<Service> {
    const existing = await this.serviceRepository.findByName(dto.name);
    if (existing) {
      throw new ServiceNameAlreadyExistsException(dto.name);
    }
    const service = Service.create({ name: dto.name, description: dto.description });
    return this.serviceRepository.create(service);
  }
}
