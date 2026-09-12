import { Inject, Injectable } from '@nestjs/common';
import { Encounter } from '../../domain/entities/encounter.entity.js';
import { ENCOUNTER_REPOSITORY } from '../../domain/interfaces/encounter-repository.interface.js';
import type { EncounterFilter, EncounterRepository } from '../../domain/interfaces/encounter-repository.interface.js';
import type { PaginationParams } from '../../../../../common/interfaces/pagination.interface.js';

@Injectable()
export class ListEncountersUseCase {
  constructor(@Inject(ENCOUNTER_REPOSITORY) private readonly encounterRepository: EncounterRepository) {}

  async execute(
    filter: EncounterFilter,
    pagination: PaginationParams,
  ): Promise<{ data: Encounter[]; total: number }> {
    return this.encounterRepository.findAll(filter, pagination);
  }
}
