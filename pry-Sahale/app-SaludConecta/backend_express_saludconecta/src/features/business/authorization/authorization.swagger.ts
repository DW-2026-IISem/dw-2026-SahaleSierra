import {
  bearerSecurity,
  forbiddenResponse,
  unauthorizedResponse,
} from "../../../shared/http/swagger-security";

/**
 * Documentación OpenAPI del feature Authorization (tabla authorizations).
 * Se agrega desde `src/swagger` (registry externo), no se monta aquí.
 *
 * Leyenda: endpoints documentados como JWT + RBAC.
 */

export const authorizationSwagger = {
  tags: [
    {
      name: "Authorizations",
      description: "CRUD de autorizaciones (0..1:1 con cita) — **JWT + RBAC**",
    },
  ],
  paths: {
    "/api/authorizations": {
      get: {
        tags: ["Authorizations"],
        summary: "Listar autorizaciones activas",
        description: "JWT + RBAC — retorna authorizations con status=active",
        security: bearerSecurity,
        responses: {
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "200": {
            description: "Lista de autorizaciones",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    authorizations: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Authorization" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Authorizations"],
        summary: "Crear autorización",
        description: "JWT + RBAC — cita activa y no cancelada; máximo una autorización por cita",
        security: bearerSecurity,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AuthorizationCreate" },
            },
          },
        },
        responses: {
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "201": {
            description: "Autorización creada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    authorization: { $ref: "#/components/schemas/Authorization" },
                  },
                },
              },
            },
          },
          "400": { description: "Cita inactiva/cancelada o ya autorizada" },
          "404": { description: "Cita no encontrada" },
        },
      },
    },
    "/api/authorizations/{id}": {
      get: {
        tags: ["Authorizations"],
        summary: "Obtener autorización por id",
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
            description: "Autorización encontrada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    authorization: { $ref: "#/components/schemas/Authorization" },
                  },
                },
              },
            },
          },
          "404": { description: "No encontrado" },
        },
      },
      put: {
        tags: ["Authorizations"],
        summary: "Actualizar autorización (PUT — reemplazo)",
        description: "JWT + RBAC — reemplaza name, description y status; appointment_id no cambia",
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
              schema: { $ref: "#/components/schemas/AuthorizationUpdate" },
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
        tags: ["Authorizations"],
        summary: "Actualizar autorización (PATCH — parcial)",
        description: "JWT + RBAC — name, description y/o status; appointment_id no cambia",
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
              schema: { $ref: "#/components/schemas/AuthorizationPatch" },
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
        tags: ["Authorizations"],
        summary: "Eliminar autorización (físico)",
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
    "/api/authorizations/{id}/deactivate": {
      patch: {
        tags: ["Authorizations"],
        summary: "Eliminar autorización (lógico)",
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
      Authorization: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "AUT-00012345" },
          description: { type: "string", example: "Autorización EPS Sura", nullable: true },
          appointment_id: { type: "integer", example: 1 },
          status: { type: "string", enum: ["active", "inactive"], example: "active" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      AuthorizationCreate: {
        type: "object",
        required: ["name", "appointment_id"],
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          appointment_id: { type: "integer" },
          status: { type: "string", enum: ["active", "inactive"], default: "active" },
        },
      },
      AuthorizationUpdate: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
      AuthorizationPatch: {
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
