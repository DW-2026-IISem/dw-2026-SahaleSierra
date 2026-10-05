/**
 * Datos de entrada de `POST /api/session/logout`.
 *
 * Se envía el refresh token que se quiere revocar (la sesión concreta). Es
 * idempotente: repetirlo no devuelve error.
 */
export interface LogoutSessionDto {
  refresh_token: string;
}
