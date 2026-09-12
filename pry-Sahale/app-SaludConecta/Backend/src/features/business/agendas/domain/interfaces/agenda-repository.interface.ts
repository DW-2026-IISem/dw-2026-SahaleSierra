import { Agenda } from '../entities/agenda.entity.js';
import type { PaginationParams } from '../../../../../common/interfaces/pagination.interface.js';

export interface AgendaFilter {
  doctorId?: number;
  name?: string;
  status?: string;
}

export const AGENDA_REPOSITORY = 'AGENDA_REPOSITORY';

export interface AgendaRepository {
  create(agenda: Agenda): Promise<Agenda>;
  findById(id: number): Promise<Agenda | null>;
  findAll(filter: AgendaFilter, pagination: PaginationParams): Promise<{ data: Agenda[]; total: number }>;
  update(id: number, agenda: Agenda): Promise<Agenda>;
  delete(id: number): Promise<void>;
}
