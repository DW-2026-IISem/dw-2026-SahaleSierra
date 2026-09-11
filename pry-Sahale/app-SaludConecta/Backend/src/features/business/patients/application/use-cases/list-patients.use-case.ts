import { Inject, Injectable } from '@nestjs/common';
import type { Patient } from '../../domain/entities/patient.entity.js';
import { PATIENT_REPOSITORY } from '../../domain/interfaces/patient-repository.interface.js';
import type {
  PatientFilter,
  PatientRepository,
} from '../../domain/interfaces/patient-repository.interface.js';
import type { PaginationParams } from '../../../../../common/interfaces/pagination.interface.js';

@Injectable()
export class ListPatientsUseCase {
  constructor(
    @Inject(PATIENT_REPOSITORY) private readonly patientRepository: PatientRepository,
  ) {}

  async execute(
    filter: PatientFilter,
    pagination: PaginationParams,
  ): Promise<{ data: Patient[]; total: number }> {
    return this.patientRepository.findAll(filter, pagination);
  }
}
