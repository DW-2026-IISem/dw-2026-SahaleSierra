import { EncounterState } from "../encounter.model";

/**
 * Datos de entrada de `PUT /api/encounters/:id`.
 *
 * Las FKs (`appointment_id`, `clinical_record_id`, `service_id`) no están aquí
 * a propósito: la atención no cambia de cita, historia ni servicio.
 */
export interface UpdateEncounterDto {
  start_date?: Date | string;
  end_date?: Date | string | null;
  total?: number;
  state?: EncounterState;
  observations?: string | null;
  status?: "active" | "inactive";
}
