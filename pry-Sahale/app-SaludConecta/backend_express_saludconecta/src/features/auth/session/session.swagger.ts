import {
  bearerSecurity,
  openSecurity,
  unauthorizedResponse,
} from "../../../shared/http/swagger-security";

/**
 * Documentación OpenAPI del feature Session — **las tres modalidades juntas**.
 *
 * - `login` / `refresh` / `logout`: **OPEN**. Nota didáctica: OPEN no significa
 *   "sin base de datos", significa "sin identidad previa". El login **lee** el
 *   hash de `users` y **escribe** `refresh_tokens`; el refresh **rota** el token.
 * - `perfil` / `permisos`: **JWT**.
 *
 * La respuesta de `login` y `refresh` es el **par de tokens**. El `refresh_token`
 * se devuelve en claro **solo aquí**: el servidor guarda únicamente su SHA-256.
 */
export const sessionSwagger = {
  tags: [
    { name: "Session", description: "Login, renovación, cierre y perfil — **OPEN** + **JWT**" },
  ],
  paths: {
    "/api/session/login": {
      post: {
        tags: ["Session"],
        summary: "Iniciar sesión (OPEN)",
        description:
          "Modalidad **OPEN**. Valida usuario/correo + contraseña y abre una sesión: " +
          "emite un access token corto (JWT) y un refresh token persistido como hash, con un `family_id` nuevo. " +
          "La respuesta es idéntica para usuario inexistente y contraseña incorrecta (no se enumeran usuarios).",
        security: openSecurity,
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/Login" } },
          },
        },
        responses: {
          "200": { description: "Par de tokens (`access_token`, `refresh_token`, `expires_in`)" },
          "400": { description: "Faltan `identifier` o `password`" },
          "401": { description: "Credenciales inválidas o usuario inactivo" },
        },
      },
    },
    "/api/session/refresh": {
      post: {
        tags: ["Session"],
        summary: "Renovar el access token (OPEN con credencial de sesión)",
        description:
          "Modalidad **OPEN**. **Rota** el refresh token: invalida el presentado y emite uno nuevo con el mismo " +
          "`family_id`. Si se presenta un token ya rotado, se interpreta como **reutilización** y se revoca toda la " +
          "familia (401). La rotación es atómica y con bloqueo de fila, así que dos peticiones simultáneas no emiten " +
          "dos tokens válidos. La ventana del refresh se reinicia en cada rotación: renovación automática mientras el usuario trabaja.",
        security: openSecurity,
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/RefreshToken" } },
          },
        },
        responses: {
          "200": { description: "Par de tokens nuevo (`access_token` + `refresh_token` rotado)" },
          "400": { description: "Falta `refresh_token`" },
          "401": {
            description:
              "Token inválido, expirado o **reutilizado** (en este último caso, la familia queda revocada)",
          },
        },
      },
    },
    "/api/session/logout": {
      post: {
        tags: ["Session"],
        summary: "Cerrar sesión (OPEN con credencial de sesión)",
        description:
          "Modalidad **OPEN**. Revoca el refresh token presentado. Idempotente: repetirlo no devuelve error. " +
          "El access token sigue siendo válido hasta expirar (vida corta); para invalidación inmediata, desactivar el usuario.",
        security: openSecurity,
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/RefreshToken" } },
          },
        },
        responses: {
          "200": { description: "Sesión cerrada (`{ message }`)" },
          "400": { description: "Falta `refresh_token`" },
        },
      },
    },
    "/api/session/profile": {
      get: {
        tags: ["Session"],
        summary: "Perfil del usuario autenticado (JWT)",
        description:
          "Modalidad **JWT**. El middleware `authenticate` valida el token y **revalida en la base** que el usuario " +
          "sigue activo: desactivar una cuenta invalida sus tokens al instante (401).",
        security: bearerSecurity,
        responses: {
          "200": { description: "Perfil (`{ user }`) — nunca incluye `password`" },
          "401": unauthorizedResponse,
        },
      },
    },
    "/api/permissions": {
      get: {
        tags: ["Session"],
        summary: "Mis permisos efectivos (JWT)",
        description:
          "Modalidad **JWT**. Ejecuta la misma consulta que el middleware `authorize` " +
          "(`resource_roles → roles → role_users → resources`, todos los eslabones activos) y devuelve el par " +
          "`(method, path)` de cada permiso. Es la herramienta para **depurar el RBAC**: lo que aparece aquí es exactamente lo que autoriza.",
        security: bearerSecurity,
        responses: {
          "200": { description: "Permisos efectivos (`{ permissions: [...] }`)" },
          "401": unauthorizedResponse,
        },
      },
    },
  },
  components: {
    schemas: {
      Login: {
        type: "object",
        required: ["identifier", "password"],
        properties: {
          identifier: { type: "string", example: "admin", description: "`username` o `email`" },
          password: { type: "string", format: "password", example: "Admin123!" },
        },
      },
      RefreshToken: {
        type: "object",
        required: ["refresh_token"],
        properties: {
          refresh_token: { type: "string", example: "9f2c... (opaco, no es un JWT)" },
        },
      },
      SessionTokens: {
        type: "object",
        properties: {
          access_token: { type: "string", description: "JWT firmado (HS256), vida corta" },
          token_type: { type: "string", example: "Bearer" },
          expires_in: {
            type: "integer",
            example: 900,
            description: "Segundos de vida del access token",
          },
          refresh_token: {
            type: "string",
            description: "Token opaco; se devuelve solo en login/refresh",
          },
          refresh_expires_in: { type: "integer", example: 604800 },
        },
      },
    },
  },
};
