/**
 * Datos de entrada de `POST /api/services`.
 *
 * `status` es opcional y por defecto `active` (lo decide el service).
 */
export interface CreateServiceDto {
  name: string;
  description?: string | null;
  status?: "active" | "inactive";
}
