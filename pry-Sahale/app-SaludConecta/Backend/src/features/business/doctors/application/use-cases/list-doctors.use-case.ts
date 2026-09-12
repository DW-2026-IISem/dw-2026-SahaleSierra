import { Inject, Injectable } from '@nestjs/common';
import { Doctor } from '../../domain/entities/doctor.entity.js';
import {
  DOCTOR_REPOSITORY,
  DoctorFilter,
  DoctorRepository,
} from '../../domain/interfaces/doctor-repository.interface.js';
import { PaginationParams } from '../../../../../common/interfaces/pagination.interface.js';

@Injectable()
export class ListDoctorsUseCase {
  constructor(
    @Inject(DOCTOR_REPOSITORY) private readonly doctorRepository: DoctorRepository,
  ) {}

  async execute(filter: DoctorFilter, pagination: PaginationParams): Promise<{ data: Doctor[]; total: number }> {
    return this.doctorRepository.findAll(filter, pagination);
  }
}
