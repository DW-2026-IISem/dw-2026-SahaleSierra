/**
 * Datos de entrada de `PUT /api/agendas/:id` (reemplazo completo).
 *
 * `status` se conserva aquí porque la API de Fase I ya lo aceptaba en PUT y
 * PATCH; si no llega, el service mantiene el estado actual.
 */
export interface UpdateAgendaDto {
  name: string;
  description?: string | null;
  doctor_id: number;
  status?: "active" | "inactive";
}
