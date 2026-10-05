import {
  bearerSecurity,
  forbiddenResponse,
  invalidIdResponse,
  notFoundResponse,
  unauthorizedResponse,
} from "../../../shared/http/swagger-security";

/**
 * Documentación OpenAPI del feature ResourceRoles — **la gestión de permisos**.
 *
 * Modalidad: **JWT + RBAC** en todas las operaciones.
 *
 * Aquí se materializa el principio de diseño: **no existe una entidad
 * `Permission`**. Conceder un permiso es crear (o reactivar) una fila en
 * `resource_roles`; el permiso es la tupla `(rol, recurso)`.
 */
export const resourceRolesSwagger = {
  tags: [
    {
      name: "ResourceRoles",
      description:
        "Conceder / retirar / reactivar recursos a un rol: **el permiso** — **JWT + RBAC**",
    },
  ],
  paths: {
    "/api/resource-roles": {
      get: {
        tags: ["ResourceRoles"],
        summary: "Listar concesiones activas",
        description:
          "JWT + RBAC — recurso `GET /api/resource-roles`. " +
          "Filtros opcionales: `?role_id=` (permisos de un rol) y `?resource_id=` (roles que conceden un recurso).",
        security: bearerSecurity,
        parameters: [
          { name: "role_id", in: "query", required: false, schema: { type: "integer" } },
          { name: "resource_id", in: "query", required: false, schema: { type: "integer" } },
        ],
        responses: {
          "200": { description: "Lista de concesiones (`{ grants: [...] }`)" },
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
        },
      },
      post: {
        tags: ["ResourceRoles"],
        summary: "Conceder recurso a rol (crear permiso)",
        description:
          "JWT + RBAC — recurso `POST /api/resource-roles`. " +
          "Cuerpo: `{ role_id, resource_id }`. Idempotente: si la concesión existía retirada, se reactiva. " +
          "Efecto inmediato y sin despliegue: la siguiente petición del usuario ya consulta la nueva matriz.",
        security: bearerSecurity,
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/ResourceRoleCreate" } },
          },
        },
        responses: {
          "201": { description: "Permiso concedido (`{ message, grant }`)" },
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "404": { description: "Rol o recurso inexistente o inactivo" },
          "409": { description: "El rol ya tiene concedido ese recurso" },
        },
      },
    },
    "/api/resource-roles/{id}": {
      get: {
        tags: ["ResourceRoles"],
        summary: "Obtener concesión por id",
        description: "JWT + RBAC — recurso `GET /api/resource-roles/:id`.",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Concesión (`{ grant }`)" },
          "400": invalidIdResponse,
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "404": notFoundResponse,
        },
      },
    },
    "/api/resource-roles/{id}/deactivate": {
      patch: {
        tags: ["ResourceRoles"],
        summary: "Retirar permiso (borrado lógico)",
        description:
          "JWT + RBAC — recurso `PATCH /api/resource-roles/:id/deactivate`. " +
          "Solo se pierde esa operación; el resto de permisos del rol siguen vigentes.",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Permiso retirado (`{ message, grant }`)" },
          "400": invalidIdResponse,
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "404": notFoundResponse,
        },
      },
    },
    "/api/resource-roles/{id}/reactivate": {
      patch: {
        tags: ["ResourceRoles"],
        summary: "Reactivar permiso",
        description: "JWT + RBAC — recurso `PATCH /api/resource-roles/:id/reactivate`.",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Permiso reactivado (`{ message, grant }`)" },
          "400": invalidIdResponse,
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "404": notFoundResponse,
          "409": { description: "La concesión ya estaba activa" },
        },
      },
    },
  },
  components: {
    schemas: {
      ResourceRole: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          role_id: { type: "integer", example: 2 },
          resource_id: { type: "integer", example: 25 },
          status: { type: "string", enum: ["active", "inactive"], example: "active" },
          role: {
            type: "object",
            properties: { id: { type: "integer" }, name: { type: "string", example: "FACTURACION" } },
          },
          resource: {
            type: "object",
            properties: {
              id: { type: "integer" },
              method: { type: "string", example: "POST" },
              path: { type: "string", example: "/api/invoices" },
              description: { type: "string", nullable: true },
            },
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      ResourceRoleCreate: {
        type: "object",
        required: ["role_id", "resource_id"],
        properties: {
          role_id: { type: "integer", example: 2 },
          resource_id: { type: "integer", example: 25 },
        },
      },
    },
  },
};
