import { Inject, Injectable } from '@nestjs/common';
import { Specialty } from '../../domain/entities/specialty.entity.js';
import { SpecialtyNameAlreadyExistsException } from '../../domain/exceptions/specialty-name-already-exists.exception.js';
import {
  SPECIALTY_REPOSITORY,
  SpecialtyRepository,
} from '../../domain/interfaces/specialty-repository.interface.js';
import { CreateSpecialtyDto } from '../dto/create-specialty.dto.js';

@Injectable()
export class CreateSpecialtyUseCase {
  constructor(
    @Inject(SPECIALTY_REPOSITORY) private readonly specialtyRepository: SpecialtyRepository,
  ) {}

  async execute(dto: CreateSpecialtyDto): Promise<Specialty> {
    const existing = await this.specialtyRepository.findByName(dto.name);
    if (existing) {
      throw new SpecialtyNameAlreadyExistsException(dto.name);
    }
    const specialty = Specialty.create({ name: dto.name, description: dto.description });
    return this.specialtyRepository.create(specialty);
  }
}
