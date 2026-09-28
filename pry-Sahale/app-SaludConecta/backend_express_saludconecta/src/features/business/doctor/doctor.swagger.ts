/**
 * Documentación OpenAPI del feature Doctor.
 * Se agrega desde `src/swagger` (registry externo), no se monta aquí.
 *
 * Leyenda: endpoints documentados como SIN AUTH (sin middleware JWT).
 */

export const doctorSwagger = {
  tags: [
    {
      name: "Doctors",
      description: "CRUD de médicos — **SIN AUTH** (sin middleware JWT)",
    },
  ],
  paths: {
    "/api/doctors": {
      get: {
        tags: ["Doctors"],
        summary: "Listar médicos activos",
        description: "SIN AUTH — retorna médicos con status=active",
        security: [],
        responses: {
          "200": {
            description: "Lista de médicos",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    doctors: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Doctor" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Doctors"],
        summary: "Crear médico",
        description: "SIN AUTH",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/DoctorCreate" },
            },
          },
        },
        responses: {
          "201": {
            description: "Médico creado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    doctor: { $ref: "#/components/schemas/Doctor" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/doctors/{id}": {
      get: {
        tags: ["Doctors"],
        summary: "Obtener médico por id",
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
            description: "Médico encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    doctor: { $ref: "#/components/schemas/Doctor" },
                  },
                },
              },
            },
          },
          "404": { description: "No encontrado" },
        },
      },
      put: {
        tags: ["Doctors"],
        summary: "Actualizar médico (PUT — reemplazo)",
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
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/DoctorUpdate" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      patch: {
        tags: ["Doctors"],
        summary: "Actualizar médico (PATCH — parcial)",
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
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/DoctorPatch" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      delete: {
        tags: ["Doctors"],
        summary: "Eliminar médico (físico)",
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
    "/api/doctors/{id}/deactivate": {
      patch: {
        tags: ["Doctors"],
        summary: "Eliminar médico (lógico)",
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
      Doctor: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Dr. Carlos Gómez" },
          description: {
            type: "string",
            example: "Médico de consulta externa, 10 años de experiencia",
            nullable: true,
          },
          status: { type: "string", enum: ["active", "inactive"], example: "active" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      DoctorCreate: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          status: { type: "string", enum: ["active", "inactive"], default: "active" },
        },
      },
      DoctorUpdate: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
      DoctorPatch: {
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
