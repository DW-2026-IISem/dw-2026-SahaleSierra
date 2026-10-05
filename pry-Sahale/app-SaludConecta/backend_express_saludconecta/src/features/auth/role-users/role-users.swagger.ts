import {
  bearerSecurity,
  forbiddenResponse,
  invalidIdResponse,
  notFoundResponse,
  unauthorizedResponse,
} from "../../../shared/http/swagger-security";

/**
 * Documentación OpenAPI del feature RoleUsers — **asignaciones usuario ↔ rol**.
 *
 * Modalidad: **JWT + RBAC** en todas las operaciones.
 *
 * Estas rutas son una de las dos vías administrativas de la autorización:
 * `POST /api/role-users` **asigna un rol a un usuario**, primer eslabón de
 * la cadena. Sin asignación activa no hay permisos, por muchos roles que existan.
 */
export const roleUsersSwagger = {
  tags: [
    {
      name: "RoleUsers",
      description:
        "Asignar / retirar / reactivar el rol de un usuario (`role_users`) — **JWT + RBAC**",
    },
  ],
  paths: {
    "/api/role-users": {
      get: {
        tags: ["RoleUsers"],
        summary: "Listar asignaciones activas",
        description:
          "JWT + RBAC — recurso `GET /api/role-users`. Incluye un resumen del usuario (sin `password`) y del rol.",
        security: bearerSecurity,
        responses: {
          "200": { description: "Lista de asignaciones (`{ assignments: [...] }`)" },
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
        },
      },
      post: {
        tags: ["RoleUsers"],
        summary: "Asignar rol a usuario",
        description:
          "JWT + RBAC — recurso `POST /api/role-users`. " +
          "Cuerpo: `{ user_id, role_id }`. Es idempotente: si la pareja existía desactivada, se reactiva. " +
          "El usuario y el rol deben estar activos.",
        security: bearerSecurity,
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/RoleUserCreate" } },
          },
        },
        responses: {
          "201": { description: "Asignación creada (`{ assignment }`)" },
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "404": { description: "Usuario o rol inexistente o inactivo" },
          "409": { description: "El rol ya está asignado a ese usuario" },
        },
      },
    },
    "/api/role-users/{id}": {
      get: {
        tags: ["RoleUsers"],
        summary: "Obtener asignación por id",
        description: "JWT + RBAC — recurso `GET /api/role-users/:id`.",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Asignación (`{ assignment }`)" },
          "400": invalidIdResponse,
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "404": notFoundResponse,
        },
      },
    },
    "/api/role-users/{id}/deactivate": {
      patch: {
        tags: ["RoleUsers"],
        summary: "Retirar rol a usuario (borrado lógico)",
        description:
          "JWT + RBAC — recurso `PATCH /api/role-users/:id/deactivate`. " +
          "Rompe el eslabón `role_users` -> el usuario pierde los permisos de ese rol de inmediato (403).",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Asignación desactivada (`{ message, assignment }`)" },
          "400": invalidIdResponse,
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "404": notFoundResponse,
        },
      },
    },
    "/api/role-users/{id}/reactivate": {
      patch: {
        tags: ["RoleUsers"],
        summary: "Reactivar asignación",
        description:
          "JWT + RBAC — recurso `PATCH /api/role-users/:id/reactivate`. Reversible: vuelve a conceder los permisos del rol.",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Asignación reactivada (`{ message, assignment }`)" },
          "400": invalidIdResponse,
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "404": notFoundResponse,
          "409": { description: "La asignación ya estaba activa" },
        },
      },
    },
  },
  components: {
    schemas: {
      RoleUser: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          user_id: { type: "integer", example: 1 },
          role_id: { type: "integer", example: 1 },
          status: { type: "string", enum: ["active", "inactive"], example: "active" },
          user: {
            type: "object",
            properties: {
              id: { type: "integer" },
              username: { type: "string" },
              email: { type: "string", format: "email" },
            },
          },
          role: {
            type: "object",
            properties: { id: { type: "integer" }, name: { type: "string" } },
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      RoleUserCreate: {
        type: "object",
        required: ["user_id", "role_id"],
        properties: {
          user_id: { type: "integer", example: 2 },
          role_id: { type: "integer", example: 2 },
        },
      },
    },
  },
};
