import { Status, Timestamps } from './api.model';

/** Tabla `authorizations` — /api/authorizations. 0..1:1 con `appointments`. */
export interface Authorization extends Timestamps {
  id: number;
  name: string; // ej. 'AUT-00012345'
  description: string | null; // ej. 'Autorización EPS Sura'
  appointment_id: number;
  status: Status;
}

export interface AuthorizationPayload {
  name: string;
  appointment_id: number;
  description?: string | null;
  status?: Status;
}

/** `appointment_id` no cambia al editar. */
export type AuthorizationUpdatePayload = Partial<
  Omit<AuthorizationPayload, 'appointment_id' | 'status'>
>;
