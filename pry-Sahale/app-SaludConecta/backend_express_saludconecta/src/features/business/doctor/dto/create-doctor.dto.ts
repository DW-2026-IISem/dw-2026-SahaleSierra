/**
 * Datos de entrada de `POST /api/doctors`.
 *
 * `status` es opcional y por defecto `active` (lo decide el service).
 */
export interface CreateDoctorDto {
  name: string;
  description?: string | null;
  status?: "active" | "inactive";
}
