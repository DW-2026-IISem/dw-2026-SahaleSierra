import { Status, Timestamps } from './api.model';

/**
 * Tabla `services` — /api/services (catálogo simple).
 * No tiene precio: el valor se registra en cada atención (`encounters.total`).
 */
export interface Service extends Timestamps {
  id: number;
  name: string;
  description: string | null;
  status: Status;
}

export interface ServicePayload {
  name: string;
  description?: string | null;
  status?: Status;
}
