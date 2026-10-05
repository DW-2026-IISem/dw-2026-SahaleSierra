/**
 * Datos de entrada de `PUT /api/services/:id` (reemplazo completo).
 *
 * `status` se conserva aquí porque la API de Fase I ya lo aceptaba en PUT y
 * PATCH; si no llega, el service mantiene el estado actual.
 */
export interface UpdateServiceDto {
  name: string;
  description?: string | null;
  status?: "active" | "inactive";
}
