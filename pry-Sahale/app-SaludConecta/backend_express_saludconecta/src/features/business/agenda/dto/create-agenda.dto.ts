/**
 * Datos de entrada de `POST /api/agendas`.
 *
 * `doctor_id` debe existir y estar activo. `status` es opcional y por defecto
 * `active` (lo decide el service).
 */
export interface CreateAgendaDto {
  name: string;
  description?: string | null;
  doctor_id: number;
  status?: "active" | "inactive";
}
