/**
 * Datos de entrada de `POST /api/authorizations`.
 *
 * La cita debe existir, estar activa y no cancelada, y no tener ya una
 * autorización (0..1:1).
 */
export interface CreateAuthorizationDto {
  name: string;
  description?: string | null;
  appointment_id: number;
  status?: "active" | "inactive";
}
