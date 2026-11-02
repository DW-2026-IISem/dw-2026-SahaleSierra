import { Status, Timestamps } from './api.model';

/** Pivote `role_users` — /api/role-users (la respuesta usa `assignments`). */
export interface RoleUser extends Timestamps {
  id: number;
  user_id: number;
  role_id: number;
  status: Status;
  user?: { id: number; username: string; email: string } | null;
  role?: { id: number; name: string } | null;
}

export interface RoleUserPayload {
  user_id: number;
  role_id: number;
}
