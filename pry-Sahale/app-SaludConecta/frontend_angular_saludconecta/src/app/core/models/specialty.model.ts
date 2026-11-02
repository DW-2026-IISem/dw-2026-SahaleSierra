import { Status, Timestamps } from './api.model';

/** Tabla `specialties` — /api/specialties (catálogo simple). */
export interface Specialty extends Timestamps {
  id: number;
  name: string;
  description: string | null;
  status: Status;
}

export interface SpecialtyPayload {
  name: string;
  description?: string | null;
  status?: Status;
}
