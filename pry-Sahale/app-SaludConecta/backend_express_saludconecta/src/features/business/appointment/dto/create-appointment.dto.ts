/**
 * Datos de entrada de `POST /api/appointments`.
 *
 * No incluye `state`: una cita siempre nace en `scheduled`.
 */
export interface CreateAppointmentDto {
  agenda_id: number;
  patient_id: number;
  start_date: Date | string;
  end_date: Date | string;
  reason?: string | null;
  status?: "active" | "inactive";
}
