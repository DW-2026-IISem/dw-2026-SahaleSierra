import { AppointmentState } from "../appointment.model";

/**
 * Datos de entrada de `PUT /api/appointments/:id`.
 *
 * Todos los campos son opcionales porque la API de Fase I conserva el valor
 * actual de los que no llegan (salvo `reason`, que se reemplaza por `null`).
 * `state` no admite `attended`: ese cambio solo lo hace `POST /api/encounters`.
 */
export interface UpdateAppointmentDto {
  agenda_id?: number;
  patient_id?: number;
  start_date?: Date | string;
  end_date?: Date | string;
  reason?: string | null;
  state?: AppointmentState;
  status?: "active" | "inactive";
}
