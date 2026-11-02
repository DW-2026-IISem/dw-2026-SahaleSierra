import { Appointment } from './appointment.model';
import { Money, Status, Timestamps, UpdatePayload } from './api.model';

export type EncounterState = 'in_progress' | 'completed' | 'cancelled';

/** Tabla `encounters` — /api/encounters. La atención de una cita. */
export interface Encounter extends Timestamps {
  id: number;
  appointment_id: number; // único
  clinical_record_id: number;
  service_id: number;
  start_date: string;
  end_date: string | null;
  total: Money; // DECIMAL → puede llegar como string
  state: EncounterState;
  observations: string | null;
  /** `null` = atención aún no facturada. */
  invoice_id: number | null;
  status: Status;
}

/**
 * Crear: la cita debe estar `scheduled` y el paciente debe tener historia clínica
 * activa (regla central del PDF). Al crearla, la cita pasa a `attended` en la
 * misma transacción.
 */
export interface EncounterPayload {
  appointment_id: number;
  service_id: number;
  start_date?: string;
  end_date?: string | null;
  total?: number; // al escribir siempre es number
  state?: 'in_progress' | 'completed';
  observations?: string | null;
  status?: Status;
}

/** `appointment_id` no cambia al editar. */
export type EncounterUpdatePayload = UpdatePayload<
  Omit<EncounterPayload, 'appointment_id' | 'state'>
> & { state?: EncounterState };

/** Respuesta de `POST /api/encounters`: 201 { encounter, appointment }. */
export interface EncounterCreateResult {
  encounter: Encounter;
  appointment: Appointment;
}
