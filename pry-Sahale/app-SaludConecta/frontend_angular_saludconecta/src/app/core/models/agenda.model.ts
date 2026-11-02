import { Status, Timestamps } from './api.model';

/** Tabla `agendas` — /api/agendas. FK a `doctors` (1:N). */
export interface Agenda extends Timestamps {
  id: number;
  name: string;
  description: string | null;
  doctor_id: number;
  status: Status;
}

export interface AgendaPayload {
  name: string;
  description?: string | null;
  doctor_id: number;
  status?: Status;
}
