import {
  bearerSecurity,
  forbiddenResponse,
  unauthorizedResponse,
} from "../../../shared/http/swagger-security";

/**
 * Documentación OpenAPI del feature Encounter (tabla encounters).
 * Se agrega desde `src/swagger` (registry externo), no se monta aquí.
 *
 * Leyenda: endpoints documentados como JWT + RBAC.
 */

export const encounterSwagger = {
  tags: [
    {
      name: "Encounters",
      description: "Atenciones: registro de la consulta (pasa la cita a attended) — **JWT + RBAC**",
    },
  ],
  paths: {
    "/api/encounters": {
      get: {
        tags: ["Encounters"],
        summary: "Listar atenciones activas",
        description: "JWT + RBAC — retorna encounters con status=active",
        security: bearerSecurity,
        responses: {
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "200": {
            description: "Lista de atenciones",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    encounters: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Encounter" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Encounters"],
        summary: "Crear atención",
        description: "JWT + RBAC — transaccional (regla del PDF): cita activa en state=scheduled, médico de la agenda activo, paciente activo, historia clínica activa del paciente y servicio activo. Al crear, la cita pasa a state=attended",
        security: bearerSecurity,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/EncounterCreate" },
            },
          },
        },
        responses: {
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "201": {
            description: "Atención creada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    encounter: { $ref: "#/components/schemas/Encounter" },
                  },
                },
              },
            },
          },
          "400": { description: "Validación (cita no programada, médico/paciente inactivo, sin historia clínica, servicio inactivo)" },
          "404": { description: "Cita o servicio no encontrado" },
        },
      },
    },
    "/api/encounters/{id}": {
      get: {
        tags: ["Encounters"],
        summary: "Obtener atención por id",
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
            description: "Atención encontrada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    encounter: { $ref: "#/components/schemas/Encounter" },
                  },
                },
              },
            },
          },
          "404": { description: "No encontrado" },
        },
      },
      put: {
        tags: ["Encounters"],
        summary: "Actualizar atención (PUT — reemplazo)",
        description: "JWT + RBAC — reemplaza datos de la atención; appointment_id, clinical_record_id y service_id no cambian",
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
              schema: { $ref: "#/components/schemas/EncounterUpdate" },
            },
          },
        },
        responses: {
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "200": { description: "Actualizado" },
          "400": { description: "Validación (total o fechas)" },
          "404": { description: "No encontrado" },
        },
      },
      patch: {
        tags: ["Encounters"],
        summary: "Actualizar atención (PATCH — parcial)",
        description: "JWT + RBAC — datos parciales; las FKs no cambian",
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
              schema: { $ref: "#/components/schemas/EncounterPatch" },
            },
          },
        },
        responses: {
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "200": { description: "Actualizado" },
          "400": { description: "Validación (total o fechas)" },
          "404": { description: "No encontrado" },
        },
      },
      delete: {
        tags: ["Encounters"],
        summary: "Eliminar atención (físico)",
        description: "JWT + RBAC — borra la atención y la cita vuelve a state=scheduled",
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
    "/api/encounters/{id}/deactivate": {
      patch: {
        tags: ["Encounters"],
        summary: "Eliminar atención (lógico)",
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
      Encounter: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          appointment_id: { type: "integer", example: 1 },
          clinical_record_id: { type: "integer", example: 1 },
          service_id: { type: "integer", example: 1 },
          start_date: { type: "string", format: "date-time" },
          end_date: { type: "string", format: "date-time", nullable: true },
          total: { type: "number", example: 85000 },
          state: { type: "string", enum: ["in_progress", "completed", "cancelled"], example: "completed" },
          observations: { type: "string", nullable: true },
          invoice_id: { type: "integer", nullable: true, example: null },
          status: { type: "string", enum: ["active", "inactive"], example: "active" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      EncounterCreate: {
        type: "object",
        required: ["appointment_id", "service_id"],
        properties: {
          appointment_id: { type: "integer" },
          service_id: { type: "integer" },
          start_date: { type: "string", format: "date-time" },
          end_date: { type: "string", format: "date-time" },
          total: { type: "number", default: 0 },
          state: { type: "string", enum: ["in_progress", "completed"], default: "in_progress" },
          observations: { type: "string" },
          status: { type: "string", enum: ["active", "inactive"], default: "active" },
        },
      },
      EncounterUpdate: {
        type: "object",
        properties: {
          start_date: { type: "string", format: "date-time" },
          end_date: { type: "string", format: "date-time" },
          total: { type: "number" },
          state: { type: "string", enum: ["in_progress", "completed", "cancelled"] },
          observations: { type: "string" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
      EncounterPatch: {
        type: "object",
        properties: {
          start_date: { type: "string", format: "date-time" },
          end_date: { type: "string", format: "date-time" },
          total: { type: "number" },
          state: { type: "string", enum: ["in_progress", "completed", "cancelled"] },
          observations: { type: "string" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
    },
  },
};
