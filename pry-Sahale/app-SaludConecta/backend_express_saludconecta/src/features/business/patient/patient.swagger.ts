import {
  bearerSecurity,
  forbiddenResponse,
  unauthorizedResponse,
} from "../../../shared/http/swagger-security";

/**
 * Documentación OpenAPI del feature Patient.
 * Se agrega desde `src/swagger` (registry externo), no se monta aquí.
 *
 * Leyenda: endpoints documentados como JWT + RBAC.
 */

export const patientSwagger = {
  tags: [
    {
      name: "Patients",
      description: "CRUD de pacientes — **JWT + RBAC**",
    },
  ],
  paths: {
    "/api/patients": {
      get: {
        tags: ["Patients"],
        summary: "Listar pacientes activos",
        description: "JWT + RBAC — retorna pacientes con status=active",
        security: bearerSecurity,
        responses: {
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "200": {
            description: "Lista de pacientes",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    patients: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Patient" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Patients"],
        summary: "Crear paciente",
        description: "JWT + RBAC — document_number es único",
        security: bearerSecurity,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PatientCreate" },
            },
          },
        },
        responses: {
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "201": {
            description: "Paciente creado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    patient: { $ref: "#/components/schemas/Patient" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/patients/{id}": {
      get: {
        tags: ["Patients"],
        summary: "Obtener paciente por id",
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
            description: "Paciente encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    patient: { $ref: "#/components/schemas/Patient" },
                  },
                },
              },
            },
          },
          "404": { description: "No encontrado" },
        },
      },
      put: {
        tags: ["Patients"],
        summary: "Actualizar paciente (PUT — reemplazo)",
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
              schema: { $ref: "#/components/schemas/PatientUpdate" },
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
        tags: ["Patients"],
        summary: "Actualizar paciente (PATCH — parcial)",
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
              schema: { $ref: "#/components/schemas/PatientPatch" },
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
        tags: ["Patients"],
        summary: "Eliminar paciente (físico)",
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
    "/api/patients/{id}/deactivate": {
      patch: {
        tags: ["Patients"],
        summary: "Eliminar paciente (lógico)",
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
      Patient: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          document_type: { type: "string", example: "CC" },
          document_number: { type: "string", example: "1001234567" },
          name: { type: "string", example: "Ana Pérez" },
          birth_date: { type: "string", format: "date", example: "1992-03-15" },
          contact: { type: "string", example: "3001234567" },
          status: { type: "string", enum: ["active", "inactive"], example: "active" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      PatientCreate: {
        type: "object",
        required: ["document_type", "document_number", "name"],
        properties: {
          document_type: { type: "string" },
          document_number: { type: "string" },
          name: { type: "string" },
          birth_date: { type: "string", format: "date" },
          contact: { type: "string" },
          status: { type: "string", enum: ["active", "inactive"], default: "active" },
        },
      },
      PatientUpdate: {
        type: "object",
        required: ["document_type", "document_number", "name"],
        properties: {
          document_type: { type: "string" },
          document_number: { type: "string" },
          name: { type: "string" },
          birth_date: { type: "string", format: "date" },
          contact: { type: "string" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
      PatientPatch: {
        type: "object",
        properties: {
          document_type: { type: "string" },
          document_number: { type: "string" },
          name: { type: "string" },
          birth_date: { type: "string", format: "date" },
          contact: { type: "string" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
    },
  },
};
