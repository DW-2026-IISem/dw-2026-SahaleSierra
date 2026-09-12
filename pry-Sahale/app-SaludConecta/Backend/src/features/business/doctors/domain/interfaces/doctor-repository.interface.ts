import { Doctor } from '../entities/doctor.entity.js';
import { PaginationParams } from '../../../../../common/interfaces/pagination.interface.js';

export interface DoctorFilter {
  name?: string;
  status?: string;
}

export const DOCTOR_REPOSITORY = 'DOCTOR_REPOSITORY';

export interface DoctorRepository {
  create(doctor: Doctor): Promise<Doctor>;
  findById(id: number): Promise<Doctor | null>;
  findAll(filter: DoctorFilter, pagination: PaginationParams): Promise<{ data: Doctor[]; total: number }>;
  update(id: number, doctor: Doctor): Promise<Doctor>;
  delete(id: number): Promise<void>;
}
