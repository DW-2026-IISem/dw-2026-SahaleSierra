import { HttpMethod } from './resource.model';

/** Respuesta de POST /api/session/login y /refresh: solo tokens. */
export interface SessionTokens {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
  refresh_token: string;
  refresh_expires_in: number;
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
