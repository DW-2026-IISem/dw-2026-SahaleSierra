import {
  bearerSecurity,
  forbiddenResponse,
  unauthorizedResponse,
} from "../../../shared/http/swagger-security";

/**
 * Documentación OpenAPI del feature Service.
 * Se agrega desde `src/swagger` (registry externo), no se monta aquí.
 *
 * Leyenda: endpoints documentados como JWT + RBAC.
 */

export const serviceSwagger = {
  tags: [
    {
      name: "Services",
      description: "CRUD de servicios ambulatorios — **JWT + RBAC**",
    },
  ],
  paths: {
    "/api/services": {
      get: {
        tags: ["Services"],
        summary: "Listar servicios activos",
        description: "JWT + RBAC — retorna servicios con status=active",
        security: bearerSecurity,
        responses: {
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "200": {
            description: "Lista de servicios",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    services: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Service" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Services"],
        summary: "Crear servicio",
        description: "JWT + RBAC",
        security: bearerSecurity,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ServiceCreate" },
            },
          },
        },
        responses: {
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "201": {
            description: "Servicio creado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    service: { $ref: "#/components/schemas/Service" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/services/{id}": {
      get: {
        tags: ["Services"],
        summary: "Obtener servicio por id",
        description: "JWT + RBAC",
        security: bearerSecurity,
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "200": {
            description: "Servicio encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    service: { $ref: "#/components/schemas/Service" },
                  },
                },
              },
            },
          },
          "404": { description: "No encontrado" },
        },
      },
      put: {
        tags: ["Services"],
        summary: "Actualizar servicio (PUT — reemplazo)",
        description: "JWT + RBAC",
        security: bearerSecurity,
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ServiceUpdate" },
            },
          },
        },
        responses: {
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      patch: {
        tags: ["Services"],
        summary: "Actualizar servicio (PATCH — parcial)",
        description: "JWT + RBAC",
        security: bearerSecurity,
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ServicePatch" },
            },
          },
        },
        responses: {
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      delete: {
        tags: ["Services"],
        summary: "Eliminar servicio (físico)",
        description: "JWT + RBAC — borra la fila",
        security: bearerSecurity,
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "200": { description: "Eliminado" },
          "404": { description: "No encontrado" },
        },
      },
    },
    "/api/services/{id}/deactivate": {
      patch: {
        tags: ["Services"],
        summary: "Eliminar servicio (lógico)",
        description: "JWT + RBAC — status = inactive",
        security: bearerSecurity,
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "200": { description: "Desactivado" },
          "404": { description: "No encontrado" },
        },
      },
    },
  },
  components: {
    schemas: {
      Service: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Consulta de medicina general" },
          description: {
            type: "string",
            example: "Servicio ambulatorio: consulta de medicina general",
            nullable: true,
          },
          status: { type: "string", enum: ["active", "inactive"], example: "active" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      ServiceCreate: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          status: { type: "string", enum: ["active", "inactive"], default: "active" },
        },
      },
      ServiceUpdate: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
      ServicePatch: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
    },
  },
};
