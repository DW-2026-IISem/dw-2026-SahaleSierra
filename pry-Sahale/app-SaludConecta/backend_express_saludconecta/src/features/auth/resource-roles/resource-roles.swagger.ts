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
        summary: "Conceder recurso a rol o guardar la matriz completa del rol",
        description:
          "JWT + RBAC — recurso `POST /api/resource-roles`. Acepta dos cuerpos:\n\n" +
          "- `{ role_id, resource_id }` → **concede un recurso** (`201`). Si la concesión existía retirada, se reactiva.\n" +
          "- `{ role_id, resource_ids }` → **guarda la matriz completa** (`200`): concede o reactiva lo que viene " +
          "y retira lo que no viene, en una transacción. `[]` deja al rol sin permisos. `ADMIN` no se edita (`409`).\n\n" +
          "Efecto inmediato y sin despliegue: la siguiente petición del usuario ya consulta la nueva matriz.",
        security: bearerSecurity,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                oneOf: [
                  { $ref: "#/components/schemas/ResourceRoleCreate" },
                  { $ref: "#/components/schemas/ResourceRoleReconcile" },
                ],
              },
              examples: {
                grant: {
                  summary: "Conceder un recurso",
                  value: { role_id: 3, resource_id: 3 },
                },
                matrix: {
                  summary: "Guardar la matriz del rol",
                  value: { role_id: 5, resource_ids: [1, 2] },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Matriz guardada (`{ message, result }`)",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ResourceRoleReconcileResponse" },
              },
            },
          },
          "201": { description: "Permiso concedido (`{ message, grant }`)" },
          "400": {
            description:
              "Cuerpo inválido: `role_id` no entero, `resource_ids` con duplicados o no enteros, " +
              "`resource_id` y `resource_ids` a la vez, o recursos inexistentes/inactivos",
          },
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "404": { description: "Rol o recurso inexistente o inactivo" },
          "409": { description: "El rol ya tiene concedido ese recurso, o se intentó editar la matriz de ADMIN" },
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
            ResourceRoleReconcile: {
        type: "object",
        required: ["role_id", "resource_ids"],
        properties: {
          role_id: { type: "integer", example: 5 },
          resource_ids: {
            type: "array",
            uniqueItems: true,
            items: { type: "integer", minimum: 1 },
            example: [1, 2],
          },
        },
      },
      ResourceRoleReconcileResponse: {
        type: "object",
        properties: {
          message: { type: "string", example: "Role permissions updated" },
          result: {
            type: "object",
            properties: {
              role_id: { type: "integer", example: 5 },
              activated: { type: "integer", example: 0 },
              deactivated: { type: "integer", example: 13 },
              total_active: { type: "integer", example: 2 },
            },
          },
        },
      },
    },
  },
};
