import { Inject, Injectable } from '@nestjs/common';
import { EncounterNotFoundException } from '../../domain/exceptions/encounter-not-found.exception.js';
import { ENCOUNTER_REPOSITORY } from '../../domain/interfaces/encounter-repository.interface.js';
import type { EncounterRepository } from '../../domain/interfaces/encounter-repository.interface.js';

@Injectable()
export class DeleteEncounterUseCase {
  constructor(@Inject(ENCOUNTER_REPOSITORY) private readonly encounterRepository: EncounterRepository) {}

  async execute(id: number): Promise<void> {
    const encounter = await this.encounterRepository.findById(id);
    if (!encounter) throw new EncounterNotFoundException(id);
    await this.encounterRepository.delete(id);
  }
}
