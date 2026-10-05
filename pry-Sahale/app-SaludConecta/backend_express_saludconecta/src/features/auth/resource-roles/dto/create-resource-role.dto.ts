/**
 * Datos de entrada de `POST /api/resource-roles` — **conceder un recurso a un rol**.
 *
 * Esta operación **crea un permiso**: el permiso no es una entidad con nombre,
 * es la tupla `(role_id, resource_id)` materializada en `resource_roles`. Si la
 * concesión ya existía inactiva, se reactiva en lugar de duplicarla.
 *
 * Ejemplo: conceder `POST /api/invoices` al rol `FACTURACION` significa que los
 * usuarios con ese rol podrán emitir facturas, sin tocar el código.
 */
export interface CreateResourceRoleDto {
  role_id: number;
  resource_id: number;
}
