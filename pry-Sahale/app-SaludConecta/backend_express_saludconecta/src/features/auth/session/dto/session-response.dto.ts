/**
 * Respuesta de `login` y `refresh`: el **par de tokens**.
 *
 * - `access_token`: JWT corto, autocontenido; viaja en `Authorization: Bearer`.
 * - `refresh_token`: token opaco larga vida; **se devuelve solo aquí**, en claro,
 *   porque el servidor guarda únicamente su hash. El cliente debe guardarlo y
 *   enviarlo a `/api/session/refresh` para renovar sin volver a autenticarse.
 * - `expires_in`: segundos de vida del token de acceso (para que el cliente
 *   programe la renovación *antes* de que expire).
 */
export interface SessionTokensDto {
  access_token: string;
  token_type: "Bearer";
  expires_in: number;
  refresh_token: string;
  refresh_expires_in: number;
}

/** Datos públicos del perfil propio (modalidad JWT). Nunca incluye `password`. */
export interface ProfileDto {
  id: number;
  username: string;
  email: string;
  avatar: string | null;
  status: "active" | "inactive";
}
