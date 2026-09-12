import { Inject, Injectable } from '@nestjs/common';
import type { Doctor } from '../../domain/entities/doctor.entity.js';
import { DOCTOR_REPOSITORY } from '../../domain/interfaces/doctor-repository.interface.js';
import type {
  DoctorFilter,
  DoctorRepository,
} from '../../domain/interfaces/doctor-repository.interface.js';
import type { PaginationParams } from '../../../../../common/interfaces/pagination.interface.js';

@Injectable()
export class ListDoctorsUseCase {
  constructor(
    @Inject(DOCTOR_REPOSITORY) private readonly doctorRepository: DoctorRepository,
  ) {}

  async execute(filter: DoctorFilter, pagination: PaginationParams): Promise<{ data: Doctor[]; total: number }> {
    return this.doctorRepository.findAll(filter, pagination);
  }
}
