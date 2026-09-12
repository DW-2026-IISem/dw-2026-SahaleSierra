import { ClinicalRecord } from '../entities/clinical-record.entity.js';
import type { PaginationParams } from '../../../../../common/interfaces/pagination.interface.js';

export interface ClinicalRecordFilter {
  patientId?: number;
  status?: string;
}

export const CLINICAL_RECORD_REPOSITORY = 'CLINICAL_RECORD_REPOSITORY';

export interface ClinicalRecordRepository {
  create(record: ClinicalRecord): Promise<ClinicalRecord>;
  findById(id: number): Promise<ClinicalRecord | null>;
  findByPatientId(patientId: number): Promise<ClinicalRecord | null>;
  findAll(
    filter: ClinicalRecordFilter,
    pagination: PaginationParams,
  ): Promise<{ data: ClinicalRecord[]; total: number }>;
  update(id: number, record: ClinicalRecord): Promise<ClinicalRecord>;
  delete(id: number): Promise<void>;
}
