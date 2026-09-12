import { Inject, Injectable } from '@nestjs/common';
import { DoctorSpecialty } from '../../domain/entities/doctor-specialty.entity.js';
import { DOCTOR_SPECIALTY_REPOSITORY } from '../../domain/interfaces/doctor-specialty-repository.interface.js';
import type { DoctorSpecialtyFilter, DoctorSpecialtyRepository } from '../../domain/interfaces/doctor-specialty-repository.interface.js';
import type { PaginationParams } from '../../../../../common/interfaces/pagination.interface.js';

@Injectable()
export class ListDoctorSpecialtiesUseCase {
  constructor(
    @Inject(DOCTOR_SPECIALTY_REPOSITORY)
    private readonly doctorSpecialtyRepository: DoctorSpecialtyRepository,
  ) {}

  async execute(
    filter: DoctorSpecialtyFilter,
    pagination: PaginationParams,
  ): Promise<{ data: DoctorSpecialty[]; total: number }> {
    return this.doctorSpecialtyRepository.findAll(filter, pagination);
  }
}
