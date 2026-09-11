import { Inject, Injectable } from '@nestjs/common';
import { PatientNotFoundException } from '../../domain/exceptions/patient-not-found.exception.js';
import { PATIENT_REPOSITORY } from '../../domain/interfaces/patient-repository.interface.js';
import type { PatientRepository } from '../../domain/interfaces/patient-repository.interface.js';

@Injectable()
export class DeletePatientUseCase {
  constructor(
    @Inject(PATIENT_REPOSITORY) private readonly patientRepository: PatientRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const patient = await this.patientRepository.findById(id);
    if (!patient) {
      throw new PatientNotFoundException(id);
    }
    await this.patientRepository.delete(id);
  }
}
