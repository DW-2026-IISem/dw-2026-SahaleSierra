import { Inject, Injectable } from '@nestjs/common';
import { Specialty } from '../../domain/entities/specialty.entity.js';
import {
  SPECIALTY_REPOSITORY,
  SpecialtyFilter,
  SpecialtyRepository,
} from '../../domain/interfaces/specialty-repository.interface.js';
import { PaginationParams } from '../../../../../common/interfaces/pagination.interface.js';

@Injectable()
export class ListSpecialtiesUseCase {
  constructor(
    @Inject(SPECIALTY_REPOSITORY) private readonly specialtyRepository: SpecialtyRepository,
  ) {}

  async execute(filter: SpecialtyFilter, pagination: PaginationParams): Promise<{ data: Specialty[]; total: number }> {
    return this.specialtyRepository.findAll(filter, pagination);
  }
}
