import { Inject, Injectable } from '@nestjs/common';
import { Patient } from '../../domain/entities/patient.entity.js';
import { PatientNotFoundException } from '../../domain/exceptions/patient-not-found.exception.js';
import {
  PATIENT_REPOSITORY,
  PatientRepository,
} from '../../domain/interfaces/patient-repository.interface.js';

@Injectable()
export class GetPatientUseCase {
  constructor(
    @Inject(PATIENT_REPOSITORY) private readonly patientRepository: PatientRepository,
  ) {}

  async execute(id: number): Promise<Patient> {
    const patient = await this.patientRepository.findById(id);
    if (!patient) {
      throw new PatientNotFoundException(id);
    }
    return patient;
  }
}
