import { Inject, Injectable } from '@nestjs/common';
import { Specialty } from '../../domain/entities/specialty.entity.js';
import { SpecialtyNotFoundException } from '../../domain/exceptions/specialty-not-found.exception.js';
import { SPECIALTY_REPOSITORY } from '../../domain/interfaces/specialty-repository.interface.js';
import type { SpecialtyRepository } from '../../domain/interfaces/specialty-repository.interface.js';

@Injectable()
export class GetSpecialtyUseCase {
  constructor(
    @Inject(SPECIALTY_REPOSITORY) private readonly specialtyRepository: SpecialtyRepository,
  ) {}

  async execute(id: number): Promise<Specialty> {
    const specialty = await this.specialtyRepository.findById(id);
    if (!specialty) {
      throw new SpecialtyNotFoundException(id);
    }
    return specialty;
  }
}
