/**
 * Datos de entrada de `POST /api/roles`.
 * `name` se normaliza a MAYÚSCULAS en el modelo.
 */
export interface CreateRoleDto {
  name: string;
  description?: string | null;
  status?: "active" | "inactive";
}
