/**
 * Datos de entrada de `POST /api/session/login` (modalidad OPEN).
 *
 * `identifier` acepta **usuario o correo**: la consulta de credenciales busca por
 * cualquiera de los dos, normalizando a minúsculas.
 */
export interface LoginDto {
  identifier: string;
  password: string;
}
