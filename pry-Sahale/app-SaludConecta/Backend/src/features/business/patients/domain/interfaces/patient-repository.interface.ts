import { Patient } from '../entities/patient.entity.js';
import { PaginationParams } from '../../../../../common/interfaces/pagination.interface.js';

export interface PatientFilter {
  name?: string;
  documentNumber?: string;
  status?: string;
}

export const PATIENT_REPOSITORY = 'PATIENT_REPOSITORY';

export interface PatientRepository {
  create(patient: Patient): Promise<Patient>;
  findById(id: number): Promise<Patient | null>;
  findByDocumentNumber(documentNumber: string): Promise<Patient | null>;
  findAll(
    filter: PatientFilter,
    pagination: PaginationParams,
  ): Promise<{ data: Patient[]; total: number }>;
  update(id: number, patient: Patient): Promise<Patient>;
  delete(id: number): Promise<void>;
}
