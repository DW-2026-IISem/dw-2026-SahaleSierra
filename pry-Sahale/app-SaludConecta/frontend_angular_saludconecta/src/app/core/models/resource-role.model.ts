import { HttpMethod } from './resource.model';
import { Status, Timestamps } from './api.model';

/** Pivote `resource_roles` — /api/resource-roles (la respuesta usa `grants`). Cada fila ES un permiso. */
export interface ResourceRole extends Timestamps {
  id: number;
  resource_id: number;
  role_id: number;
  status: Status;
  role?: { id: number; name: string } | null;
  resource?: {
    id: number;
    method: HttpMethod;
    path: string;
    description: string | null;
  } | null;
}

export interface ResourceRolePayload {
  role_id: number;
  resource_id: number;
}

/** Cuerpo de `POST /api/resource-roles` para guardar la matriz completa de un rol. */
export interface PermissionMatrixPayload {
  role_id: number;
  resource_ids: number[];
}

/** `result` de la respuesta del guardado: cuántas concesiones cambiaron. */
export interface RoleGrantReconciliation {
  role_id: number;
  activated: number;
  deactivated: number;
  total_active: number;
}
