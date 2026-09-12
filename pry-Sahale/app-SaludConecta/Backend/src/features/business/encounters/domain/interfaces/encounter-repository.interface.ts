import { Encounter } from '../entities/encounter.entity.js';
import type { PaginationParams } from '../../../../../common/interfaces/pagination.interface.js';

export interface EncounterFilter {
  appointmentId?: number;
  serviceId?: number;
  clinicalRecordId?: number;
  status?: string;
}

export const ENCOUNTER_REPOSITORY = 'ENCOUNTER_REPOSITORY';

export interface EncounterRepository {
  create(encounter: Encounter): Promise<Encounter>;
  findById(id: number): Promise<Encounter | null>;
  findByAppointmentId(appointmentId: number): Promise<Encounter | null>;
  findAll(
    filter: EncounterFilter,
    pagination: PaginationParams,
  ): Promise<{ data: Encounter[]; total: number }>;
  update(id: number, encounter: Encounter): Promise<Encounter>;
  delete(id: number): Promise<void>;
}
