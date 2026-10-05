import { EncounterState } from "../encounter.model";

/**
 * Datos de entrada de `POST /api/encounters` — registrar la atención de una cita.
 *
 * No incluye `clinical_record_id`: se deriva del paciente de la cita, para que
 * la atención no pueda quedar asociada a la historia de otro paciente.
 * `state` al crear solo admite `in_progress` (por defecto) o `completed`.
 */
export interface CreateEncounterDto {
  appointment_id: number;
  service_id: number;
  start_date?: Date | string;
  end_date?: Date | string | null;
  total?: number;
  state?: EncounterState;
  observations?: string | null;
  status?: "active" | "inactive";
}
