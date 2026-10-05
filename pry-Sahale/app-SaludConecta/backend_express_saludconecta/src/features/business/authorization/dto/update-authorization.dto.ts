/**
 * Datos de entrada de `PUT /api/authorizations/:id`.
 *
 * `appointment_id` no está aquí a propósito: la autorización no cambia de cita.
 */
export interface UpdateAuthorizationDto {
  name: string;
  description?: string | null;
  status?: "active" | "inactive";
}
