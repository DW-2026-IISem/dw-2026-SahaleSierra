import { Inject, Injectable } from '@nestjs/common';
import { Patient } from '../../domain/entities/patient.entity.js';
import { PatientNotFoundException } from '../../domain/exceptions/patient-not-found.exception.js';
import {
  PATIENT_REPOSITORY,
  PatientRepository,
} from '../../domain/interfaces/patient-repository.interface.js';
import { UpdatePatientDto } from '../dto/update-patient.dto.js';

@Injectable()
export class UpdatePatientUseCase {
  constructor(
    @Inject(PATIENT_REPOSITORY) private readonly patientRepository: PatientRepository,
  ) {}

  async execute(id: number, dto: UpdatePatientDto): Promise<Patient> {
    const patient = await this.patientRepository.findById(id);
    if (!patient) {
      throw new PatientNotFoundException(id);
    }

    patient.update({
      documentType: dto.documentType,
      name: dto.name,
      birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
      contact: dto.contact,
    });

    return this.patientRepository.update(id, patient);
  }
}
