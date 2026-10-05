import {
  bearerSecurity,
  forbiddenResponse,
  invalidIdResponse,
  notFoundResponse,
  unauthorizedResponse,
} from "../../../shared/http/swagger-security";

/**
 * Documentación OpenAPI del feature Resources.
 *
 * Modalidad: **JWT + RBAC** en todas las operaciones.
 *
 * Un recurso es un par `(method, path)` con la ruta **en patrón**
 * (`/api/patients/:id`). `GET` y `POST` sobre la misma ruta son dos recursos
 * distintos y se conceden por separado.
 */
export const resourcesSwagger = {
  tags: [
    {
      name: "Resources",
      description:
        "Catálogo de puntos de acceso protegibles: par `(method, path)` — **JWT + RBAC**",
    },
  ],
  paths: {
    "/api/resources": {
      get: {
        tags: ["Resources"],
        summary: "Listar recursos activos",
        description: "JWT + RBAC — recurso `GET /api/resources`.",
        security: bearerSecurity,
        responses: {
          "200": { description: "Lista de recursos (`{ resources: [...] }`)" },
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
        },
      },
      post: {
        tags: ["Resources"],
        summary: "Crear recurso",
        description:
          "JWT + RBAC — recurso `POST /api/resources`. Alta de un nuevo punto de acceso; concederlo a un rol no requiere desplegar código.",
        security: bearerSecurity,
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/ResourceCreate" } },
          },
        },
        responses: {
          "201": { description: "Recurso creado (`{ resource }`)" },
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "409": { description: "La tupla `(method, path)` ya existe" },
        },
      },
    },
    "/api/resources/{id}": {
      get: {
        tags: ["Resources"],
        summary: "Obtener recurso por id",
        description: "JWT + RBAC — recurso `GET /api/resources/:id`.",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Recurso (`{ resource }`)" },
          "400": invalidIdResponse,
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "404": notFoundResponse,
        },
      },
      put: {
        tags: ["Resources"],
        summary: "Reemplazar recurso (PUT)",
        description: "JWT + RBAC — recurso `PUT /api/resources/:id`.",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/ResourceUpdate" } },
          },
        },
        responses: {
          "200": { description: "Recurso actualizado (`{ resource }`)" },
          "400": invalidIdResponse,
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "404": notFoundResponse,
        },
      },
      patch: {
        tags: ["Resources"],
        summary: "Modificar recurso (PATCH)",
        description: "JWT + RBAC — recurso `PATCH /api/resources/:id`.",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/ResourcePatch" } },
          },
        },
        responses: {
          "200": { description: "Recurso actualizado (`{ resource }`)" },
          "400": invalidIdResponse,
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "404": notFoundResponse,
        },
      },
      delete: {
        tags: ["Resources"],
        summary: "Eliminar recurso (físico)",
        description: "JWT + RBAC — recurso `DELETE /api/resources/:id`.",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Eliminado (`{ message, id }`)" },
          "400": invalidIdResponse,
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "404": notFoundResponse,
        },
      },
    },
    "/api/resources/{id}/deactivate": {
      patch: {
        tags: ["Resources"],
        summary: "Desactivar recurso (borrado lógico)",
        description:
          "JWT + RBAC — recurso `PATCH /api/resources/:id/deactivate`. " +
          "Efecto inmediato: ningún rol puede autorizar ese punto de acceso (eslabón `resources` inactivo -> DENY).",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Desactivado (`{ message, resource }`)" },
          "400": invalidIdResponse,
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "404": notFoundResponse,
        },
      },
    },
  },
  components: {
    schemas: {
      Resource: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          method: {
            type: "string",
            enum: ["GET", "POST", "PUT", "PATCH", "DELETE"],
            example: "GET",
          },
          path: { type: "string", example: "/api/patients/:id" },
          description: { type: "string", nullable: true },
          status: { type: "string", enum: ["active", "inactive"], example: "active" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      ResourceCreate: {
        type: "object",
        required: ["method", "path"],
        properties: {
          method: { type: "string", enum: ["GET", "POST", "PUT", "PATCH", "DELETE"] },
          path: { type: "string", example: "/api/reportes/:id" },
          description: { type: "string", nullable: true },
          status: { type: "string", enum: ["active", "inactive"], default: "active" },
        },
      },
      ResourceUpdate: {
        type: "object",
        required: ["method", "path"],
        properties: {
          method: { type: "string", enum: ["GET", "POST", "PUT", "PATCH", "DELETE"] },
          path: { type: "string" },
          description: { type: "string", nullable: true },
        },
      },
      ResourcePatch: {
        type: "object",
        properties: {
          method: { type: "string", enum: ["GET", "POST", "PUT", "PATCH", "DELETE"] },
          path: { type: "string" },
          description: { type: "string", nullable: true },
        },
      },
    },
  },
};
