import {
  bearerSecurity,
  invalidIdResponse,
  unauthorizedResponse,
} from "../../../shared/http/swagger-security";

/**
 * Documentación OpenAPI del feature RefreshTokens — **sesiones propias**.
 *
 * Modalidad: **JWT** (sin RBAC). No forman parte del catálogo de recursos: ver y
 * revocar las **propias** sesiones deriva de estar autenticado, no de un permiso
 * concedido. Un `id` de sesión ajeno responde **404** (no se filtra su existencia).
 */
export const refreshTokensSwagger = {
  tags: [
    {
      name: "Sessions",
      description:
        "Sesiones persistidas del usuario autenticado (refresh tokens): listar, consultar y revocar — **JWT**",
    },
  ],
  paths: {
    "/api/sessions": {
      get: {
        tags: ["Sessions"],
        summary: "Listar mis sesiones activas",
        description:
          "JWT — devuelve las sesiones del usuario del token. `token_hash` nunca se expone.",
        security: bearerSecurity,
        responses: {
          "200": { description: "Sesiones propias (`{ sessions: [...] }`)" },
          "401": unauthorizedResponse,
        },
      },
      delete: {
        tags: ["Sessions"],
        summary: "Purgar mis sesiones revocadas/expiradas",
        description: "JWT — borrado físico de las sesiones propias ya inútiles.",
        security: bearerSecurity,
        responses: {
          "200": { description: "Purga realizada (`{ message, purged }`)" },
          "401": unauthorizedResponse,
        },
      },
    },
    "/api/sessions/deactivate-all": {
      patch: {
        tags: ["Sessions"],
        summary: "Revocar todas mis sesiones",
        description:
          "JWT — pone `inactive` todas las sesiones propias (todos los dispositivos). " +
          "Útil ante sospecha de robo: el refresh token deja de servir de inmediato.",
        security: bearerSecurity,
        responses: {
          "200": { description: "Sesiones revocadas (`{ message, revoked }`)" },
          "401": unauthorizedResponse,
        },
      },
    },
    "/api/sessions/{id}": {
      get: {
        tags: ["Sessions"],
        summary: "Consultar una sesión propia",
        description:
          "JWT — `family_id`, `device_info`, `expires_at`, `status`. 404 si no es del usuario.",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Sesión (`{ session }`)" },
          "400": invalidIdResponse,
          "401": unauthorizedResponse,
          "404": { description: "No encontrada o no pertenece al usuario autenticado" },
        },
      },
    },
    "/api/sessions/{id}/deactivate": {
      patch: {
        tags: ["Sessions"],
        summary: "Revocar una sesión propia",
        description: "JWT — revocación lógica de una sesión concreta.",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Sesión revocada (`{ message, session }`)" },
          "400": invalidIdResponse,
          "401": unauthorizedResponse,
          "404": { description: "No encontrada o no pertenece al usuario autenticado" },
        },
      },
    },
  },
  components: {
    schemas: {
      Session: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          user_id: { type: "integer", example: 2 },
          family_id: { type: "string", format: "uuid" },
          device_info: { type: "string", nullable: true, example: "Mozilla/5.0 ..." },
          expires_at: { type: "string", format: "date-time" },
          status: { type: "string", enum: ["active", "inactive"], example: "active" },
          is_expired: { type: "boolean", example: false },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
    },
  },
};
