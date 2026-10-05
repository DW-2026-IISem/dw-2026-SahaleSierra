/**
 * Filtros de `GET /api/resource-roles`.
 * Permiten pedir "los permisos de este rol" o "los roles que conceden este recurso".
 */
export interface ListResourceRolesDto {
  role_id?: number;
  resource_id?: number;
}
