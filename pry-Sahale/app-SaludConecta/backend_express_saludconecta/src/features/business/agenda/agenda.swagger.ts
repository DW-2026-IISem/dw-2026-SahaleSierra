/**
 * Documentación OpenAPI del feature Agenda (tabla agendas).
 * Se agrega desde `src/swagger` (registry externo), no se monta aquí.
 *
 * Leyenda: endpoints documentados como SIN AUTH (sin middleware JWT).
 */

export const agendaSwagger = {
  tags: [
    {
      name: "Agendas",
      description: "CRUD de agendas de médicos — **SIN AUTH** (sin middleware JWT)",
    },
  ],
  paths: {
    "/api/agendas": {
      get: {
        tags: ["Agendas"],
        summary: "Listar agendas activas",
        description: "SIN AUTH — retorna agendas con status=active",
        security: [],
        responses: {
          "200": {
            description: "Lista de agendas",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    agendas: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Agenda" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Agendas"],
        summary: "Crear agenda",
        description: "SIN AUTH — doctor_id debe existir y estar active",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AgendaCreate" },
            },
          },
        },
        responses: {
          "201": {
            description: "Agenda creada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    agenda: { $ref: "#/components/schemas/Agenda" },
                  },
                },
              },
            },
          },
          "400": { description: "Médico inactivo" },
          "404": { description: "Médico no encontrado" },
        },
      },
    },
    "/api/agendas/{id}": {
      get: {
        tags: ["Agendas"],
        summary: "Obtener agenda por id",
        description: "SIN AUTH",
        security: [],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": {
            description: "Agenda encontrada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    agenda: { $ref: "#/components/schemas/Agenda" },
                  },
                },
              },
            },
          },
          "404": { description: "No encontrado" },
        },
      },
      put: {
        tags: ["Agendas"],
        summary: "Actualizar agenda (PUT — reemplazo)",
        description: "SIN AUTH — doctor_id debe existir y estar active",
        security: [],
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
              schema: { $ref: "#/components/schemas/AgendaUpdate" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "400": { description: "Médico inactivo" },
          "404": { description: "No encontrado" },
        },
      },
      patch: {
        tags: ["Agendas"],
        summary: "Actualizar agenda (PATCH — parcial)",
        description: "SIN AUTH — si envía doctor_id, debe existir y estar active",
        security: [],
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
              schema: { $ref: "#/components/schemas/AgendaPatch" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "400": { description: "Médico inactivo" },
          "404": { description: "No encontrado" },
        },
      },
      delete: {
        tags: ["Agendas"],
        summary: "Eliminar agenda (físico)",
        description: "SIN AUTH — borra la fila",
        security: [],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": { description: "Eliminado" },
          "404": { description: "No encontrado" },
        },
      },
    },
    "/api/agendas/{id}/deactivate": {
      patch: {
        tags: ["Agendas"],
        summary: "Eliminar agenda (lógico)",
        description: "SIN AUTH — status = inactive",
        security: [],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": { description: "Desactivado" },
          "404": { description: "No encontrado" },
        },
      },
    },
  },
  components: {
    schemas: {
      Agenda: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Agenda Mañana — Dr. Carlos Gómez" },
          description: {
            type: "string",
            example: "Lunes a viernes, jornada de la mañana",
            nullable: true,
          },
          doctor_id: { type: "integer", example: 1 },
          status: { type: "string", enum: ["active", "inactive"], example: "active" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      AgendaCreate: {
        type: "object",
        required: ["name", "doctor_id"],
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          doctor_id: { type: "integer" },
          status: { type: "string", enum: ["active", "inactive"], default: "active" },
        },
      },
      AgendaUpdate: {
        type: "object",
        required: ["name", "doctor_id"],
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          doctor_id: { type: "integer" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
      AgendaPatch: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          doctor_id: { type: "integer" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
    },
  },
};
