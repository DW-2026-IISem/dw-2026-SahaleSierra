import { Inject, Injectable } from '@nestjs/common';
import { Patient } from '../../domain/entities/patient.entity.js';
import { PatientDocumentAlreadyExistsException } from '../../domain/exceptions/patient-document-already-exists.exception.js';
import { PATIENT_REPOSITORY } from '../../domain/interfaces/patient-repository.interface.js';
import type { PatientRepository } from '../../domain/interfaces/patient-repository.interface.js';
import { CreatePatientDto } from '../dto/create-patient.dto.js';

@Injectable()
export class CreatePatientUseCase {
  constructor(
    @Inject(PATIENT_REPOSITORY) private readonly patientRepository: PatientRepository,
  ) {}

  async execute(dto: CreatePatientDto): Promise<Patient> {
    const existing = await this.patientRepository.findByDocumentNumber(dto.documentNumber);
    if (existing) {
      throw new PatientDocumentAlreadyExistsException(dto.documentNumber);
    }

    const patient = Patient.create({
      documentType: dto.documentType,
      documentNumber: dto.documentNumber,
      name: dto.name,
      birthDate: new Date(dto.birthDate),
      contact: dto.contact,
    });

    return this.patientRepository.create(patient);
  }
}
