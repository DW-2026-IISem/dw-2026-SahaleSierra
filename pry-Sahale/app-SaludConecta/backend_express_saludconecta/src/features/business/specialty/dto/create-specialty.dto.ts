/**
 * Datos de entrada de `POST /api/specialties`.
 *
 * `status` es opcional y por defecto `active` (lo decide el service).
 */
export interface CreateSpecialtyDto {
  name: string;
  description?: string | null;
  status?: "active" | "inactive";
}
