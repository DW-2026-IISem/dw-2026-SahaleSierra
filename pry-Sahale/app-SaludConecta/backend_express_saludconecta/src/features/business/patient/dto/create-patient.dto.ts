/**
 * Datos de entrada de `POST /api/patients`.
 *
 * `status` es opcional y por defecto `active` (lo decide el service).
 */
export interface CreatePatientDto {
  document_type: string;
  document_number: string;
  name: string;
  birth_date: Date | string;
  contact: string;
  status?: "active" | "inactive";
}
