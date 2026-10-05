/**
 * Datos de entrada de `PUT /api/doctors/:id` (reemplazo completo).
 *
 * `status` se conserva aquí porque la API de Fase I ya lo aceptaba en PUT y
 * PATCH; si no llega, el service mantiene el estado actual.
 */
export interface UpdateDoctorDto {
  name: string;
  description?: string | null;
  status?: "active" | "inactive";
}
