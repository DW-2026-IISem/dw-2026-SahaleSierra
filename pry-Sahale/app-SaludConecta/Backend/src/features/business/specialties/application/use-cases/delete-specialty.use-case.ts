import { Inject, Injectable } from '@nestjs/common';
import { SpecialtyNotFoundException } from '../../domain/exceptions/specialty-not-found.exception.js';
import {
  SPECIALTY_REPOSITORY,
  SpecialtyRepository,
} from '../../domain/interfaces/specialty-repository.interface.js';

@Injectable()
export class DeleteSpecialtyUseCase {
  constructor(
    @Inject(SPECIALTY_REPOSITORY) private readonly specialtyRepository: SpecialtyRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const specialty = await this.specialtyRepository.findById(id);
    if (!specialty) {
      throw new SpecialtyNotFoundException(id);
    }
    await this.specialtyRepository.delete(id);
  }
}
