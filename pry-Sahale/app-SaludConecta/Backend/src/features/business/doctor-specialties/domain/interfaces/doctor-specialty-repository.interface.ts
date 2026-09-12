import { DoctorSpecialty } from '../entities/doctor-specialty.entity.js';
import type { PaginationParams } from '../../../../../common/interfaces/pagination.interface.js';

export interface DoctorSpecialtyFilter {
  doctorId?: number;
  specialtyId?: number;
  status?: string;
}

export const DOCTOR_SPECIALTY_REPOSITORY = 'DOCTOR_SPECIALTY_REPOSITORY';

export interface DoctorSpecialtyRepository {
  create(relation: DoctorSpecialty): Promise<DoctorSpecialty>;
  findById(id: number): Promise<DoctorSpecialty | null>;
  findByPair(doctorId: number, specialtyId: number): Promise<DoctorSpecialty | null>;
  findAll(
    filter: DoctorSpecialtyFilter,
    pagination: PaginationParams,
  ): Promise<{ data: DoctorSpecialty[]; total: number }>;
  delete(id: number): Promise<void>;
}
