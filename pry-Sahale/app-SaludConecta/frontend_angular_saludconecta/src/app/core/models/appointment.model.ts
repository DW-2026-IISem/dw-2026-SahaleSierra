import { Status, Timestamps, UpdatePayload } from './api.model';

/** Estado de negocio de la cita; es distinto de `status` (baja lógica). */
export type AppointmentState = 'scheduled' | 'attended' | 'cancelled';

/** Tabla `appointments` — /api/appointments. start/end_date llegan en UTC. */
export interface Appointment extends Timestamps {
  id: number;
  agenda_id: number;
  patient_id: number;
  start_date: string;
  end_date: string;
  reason: string | null;
  state: AppointmentState;
  status: Status;
}

/** Crear: la cita siempre nace en `state = 'scheduled'`; no se envía `state`. */
export interface AppointmentPayload {
  agenda_id: number;
  patient_id: number;
  start_date: string;
  end_date: string;
  reason?: string | null;
  status?: Status;
}

/**
 * Editar: `state` solo admite 'scheduled' o 'cancelled'. Nunca 'attended':
 * la cita pasa a `attended` únicamente con POST /api/encounters.
 */
export type AppointmentUpdatePayload = UpdatePayload<AppointmentPayload> & {
  state?: Exclude<AppointmentState, 'attended'>;
};
