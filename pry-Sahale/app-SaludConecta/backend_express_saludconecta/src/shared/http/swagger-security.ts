/**
 * Piezas reutilizables de OpenAPI para las **tres modalidades de acceso**.
 *
 * Centralizar aquí el esquema `bearerAuth` y las respuestas 401/403 evita repetir
 * la misma definición en los 7 módulos de Swagger (auth) y en los 5 de business.
 * Al cambiar una descripción, cambia en toda la documentación.
 *
 * Convención de uso en cada operación:
 *
 * | Modalidad | `security` |
 * |---|---|
 * | OPEN  | `openSecurity`  (arreglo vacío: no exige credencial) |
 * | JWT   | `bearerSecurity` |
 * | RBAC  | `bearerSecurity` + respuestas 401 **y** 403 |
 */

/** Esquema de seguridad (RFC 6750: `Authorization: Bearer <token>`). */
export const bearerSecurityScheme = {
  bearerAuth: {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
    description:
      "Access token JWT obtenido en `POST /api/session/login`. Enviar como " +
      "`Authorization: Bearer <access_token>`. Vida útil corta (por defecto 15 min); " +
      "se renueva con `POST /api/session/refresh`.",
  },
};

/** `security` de un endpoint OPEN (no exige credencial). */
export const openSecurity: unknown[] = [];

/** `security` de un endpoint JWT o RBAC (exige access token válido). */
export const bearerSecurity = [{ bearerAuth: [] }];

/** Respuesta 401: no hay identidad válida (token ausente, inválido o usuario inactivo). */
export const unauthorizedResponse = {
  description:
    "401 No autenticado — falta el Bearer token, el token es inválido/expiró o el usuario está inactivo",
};

/** Respuesta 403: hay identidad, pero la matriz RBAC no concede `(method, path)`. */
export const forbiddenResponse = {
  description:
    "403 Prohibido — autenticado, pero sin concesión activa para esta operación (deny by default)",
};

/** Respuesta 400 ante un `:id` que no es entero positivo. */
export const invalidIdResponse = {
  description: "400 id inválido (debe ser un entero positivo)",
};

/** Respuesta 404 estándar. */
export const notFoundResponse = {
  description: "404 No encontrado",
};
