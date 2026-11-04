import { HttpMethod } from './resource.model';
import { User } from './user.model';

/** POST /api/session/login — `identifier` acepta username o email. */
export interface LoginRequest {
  identifier: string;
  password: string;
}

/** Respuesta de POST /api/session/login y /refresh: solo tokens. */
export interface SessionTokens {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
  refresh_token: string;
  refresh_expires_in: number;
}

/** GET /api/session/profile */
export interface ProfilePayload {
  user: User;
}

/** Una fila de GET /api/permissions; `path` llega como patrón (`/api/patients/:id`). */
export interface EffectivePermission {
  resource_id: number;
  method: HttpMethod;
  path: string;
  description: string | null;
  role_id: number;
  role_name: string;
}

/** GET /api/permissions · GET /api/users/:id/permissions */
export interface PermissionsPayload {
  permissions: EffectivePermission[];
}

/** Estado compuesto que mantiene SessionStore tras login y "Actualizar permisos". */
export interface AccessPayload {
  user: User;
  permissions: EffectivePermission[];
}
