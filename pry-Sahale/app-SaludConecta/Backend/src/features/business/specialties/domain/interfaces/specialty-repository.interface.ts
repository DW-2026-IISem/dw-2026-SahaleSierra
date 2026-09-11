import { Specialty } from '../entities/specialty.entity.js';
import { PaginationParams } from '../../../../../common/interfaces/pagination.interface.js';

export interface SpecialtyFilter {
  name?: string;
  status?: string;
}

export const SPECIALTY_REPOSITORY = 'SPECIALTY_REPOSITORY';

export interface SpecialtyRepository {
  create(specialty: Specialty): Promise<Specialty>;
  findById(id: number): Promise<Specialty | null>;
  findByName(name: string): Promise<Specialty | null>;
  findAll(filter: SpecialtyFilter, pagination: PaginationParams): Promise<{ data: Specialty[]; total: number }>;
  update(id: number, specialty: Specialty): Promise<Specialty>;
  delete(id: number): Promise<void>;
}
