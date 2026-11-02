import { Status, Timestamps } from './api.model';

/** Tabla `doctors` — /api/doctors (catálogo simple). */
export interface Doctor extends Timestamps {
  id: number;
  name: string;
  description: string | null;
  status: Status;
}

export interface DoctorPayload {
  name: string;
  description?: string | null;
  status?: Status;
}
