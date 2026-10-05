/**
 * Datos de entrada de `PUT /api/patients/:id` (reemplazo completo).
 *
 * `status` se conserva aquí porque la API de Fase I ya lo aceptaba en PUT y
 * PATCH; si no llega, el service mantiene el estado actual.
 */
export interface UpdatePatientDto {
  document_type: string;
  document_number: string;
  name: string;
  birth_date: Date | string;
  contact: string;
  status?: "active" | "inactive";
}
