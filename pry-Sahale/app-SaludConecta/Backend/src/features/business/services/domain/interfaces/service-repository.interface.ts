import { Service } from '../entities/service.entity.js';
import type { PaginationParams } from '../../../../../common/interfaces/pagination.interface.js';

export interface ServiceFilter {
  name?: string;
  status?: string;
}

export const SERVICE_REPOSITORY = 'SERVICE_REPOSITORY';

export interface ServiceRepository {
  create(service: Service): Promise<Service>;
  findById(id: number): Promise<Service | null>;
  findByName(name: string): Promise<Service | null>;
  findAll(filter: ServiceFilter, pagination: PaginationParams): Promise<{ data: Service[]; total: number }>;
  update(id: number, service: Service): Promise<Service>;
  delete(id: number): Promise<void>;
}
