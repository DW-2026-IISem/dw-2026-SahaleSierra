import { ResourceRole, ResourceRoleI } from "../resource-role.model";

/**
 * Respuesta HTTP de una concesión rol-recurso (un permiso).
 *
 * Incluye un resumen del rol y del recurso: `resource` lleva `(method, path)`,
 * que es exactamente el par que evalúa el middleware de autorización.
 */
export interface ResourceRoleResponseDto extends ResourceRoleI {
  role?: { id: number; name: string } | null;
  resource?: {
    id: number;
    method: string;
    path: string;
    description: string | null;
  } | null;
}

/** Mapper modelo -> DTO de respuesta (objeto plano). */
export function toResourceRoleResponse(resourceRole: ResourceRole): ResourceRoleResponseDto {
  return resourceRole.toJSON() as ResourceRoleResponseDto;
}

/**
 * Un permiso **efectivo**: el resultado de recorrer la cadena completa
 * `role_users → roles → resource_roles → resources` para un usuario concreto.
 *
 * Es plano a propósito: el middleware de autorización solo necesita
 * `(method, path)`; el resto es información útil para el endpoint de consulta.
 */
export interface EffectivePermissionDto {
  resource_id: number;
  method: string;
  path: string;
  description: string | null;
  role_id: number;
  role_name: string;
}
