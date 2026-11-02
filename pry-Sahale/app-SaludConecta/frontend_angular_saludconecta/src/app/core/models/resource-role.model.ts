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
