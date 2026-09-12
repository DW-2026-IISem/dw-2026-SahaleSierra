import { Inject, Injectable } from '@nestjs/common';
import { Specialty } from '../../domain/entities/specialty.entity.js';
import { SpecialtyNotFoundException } from '../../domain/exceptions/specialty-not-found.exception.js';
import {
  SPECIALTY_REPOSITORY,
  SpecialtyRepository,
} from '../../domain/interfaces/specialty-repository.interface.js';
import { UpdateSpecialtyDto } from '../dto/update-specialty.dto.js';

@Injectable()
export class UpdateSpecialtyUseCase {
  constructor(
    @Inject(SPECIALTY_REPOSITORY) private readonly specialtyRepository: SpecialtyRepository,
  ) {}

  async execute(id: number, dto: UpdateSpecialtyDto): Promise<Specialty> {
    const specialty = await this.specialtyRepository.findById(id);
    if (!specialty) {
      throw new SpecialtyNotFoundException(id);
    }
    specialty.update({ name: dto.name, description: dto.description });
    return this.specialtyRepository.update(id, specialty);
  }
}
