import { Inject, Injectable } from '@nestjs/common';
import { Encounter } from '../../domain/entities/encounter.entity.js';
import { EncounterNotFoundException } from '../../domain/exceptions/encounter-not-found.exception.js';
import { ENCOUNTER_REPOSITORY } from '../../domain/interfaces/encounter-repository.interface.js';
import type { EncounterRepository } from '../../domain/interfaces/encounter-repository.interface.js';
import { UpdateEncounterDto } from '../dto/update-encounter.dto.js';

@Injectable()
export class UpdateEncounterUseCase {
  constructor(@Inject(ENCOUNTER_REPOSITORY) private readonly encounterRepository: EncounterRepository) {}

  async execute(id: number, dto: UpdateEncounterDto): Promise<Encounter> {
    const encounter = await this.encounterRepository.findById(id);
    if (!encounter) throw new EncounterNotFoundException(id);
    encounter.update({ total: dto.total, observations: dto.observations });
    return this.encounterRepository.update(id, encounter);
  }
}
