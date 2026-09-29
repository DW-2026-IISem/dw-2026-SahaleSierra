/**
 * Documentación OpenAPI del feature ClinicalRecord (tabla clinical_records).
 * Se agrega desde `src/swagger` (registry externo), no se monta aquí.
 *
 * Leyenda: endpoints documentados como SIN AUTH (sin middleware JWT).
 */

export const clinicalRecordSwagger = {
  tags: [
    {
      name: "ClinicalRecords",
      description: "CRUD de historias clínicas (1:1 con paciente) — **SIN AUTH** (sin middleware JWT)",
    },
  ],
  paths: {
    "/api/clinical-records": {
      get: {
        tags: ["ClinicalRecords"],
        summary: "Listar historias clínicas activas",
        description: "SIN AUTH — retorna clinical_records con status=active",
        security: [],
        responses: {
          "200": {
            description: "Lista de historias clínicas",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    clinical_records: {
                      type: "array",
                      items: { $ref: "#/components/schemas/ClinicalRecord" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["ClinicalRecords"],
        summary: "Crear historia clínica",
        description: "SIN AUTH — paciente activo y sin historia previa (1:1)",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ClinicalRecordCreate" },
            },
          },
        },
        responses: {
          "201": {
            description: "Historia clínica creada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    clinical_record: { $ref: "#/components/schemas/ClinicalRecord" },
                  },
                },
              },
            },
          },
          "400": { description: "Paciente inactivo o ya tiene historia clínica" },
          "404": { description: "Paciente no encontrado" },
        },
      },
    },
    "/api/clinical-records/{id}": {
      get: {
        tags: ["ClinicalRecords"],
        summary: "Obtener historia clínica por id",
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
            description: "Historia clínica encontrada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    clinical_record: { $ref: "#/components/schemas/ClinicalRecord" },
                  },
                },
              },
            },
          },
          "404": { description: "No encontrado" },
        },
      },
      put: {
        tags: ["ClinicalRecords"],
        summary: "Actualizar historia clínica (PUT — reemplazo)",
        description: "SIN AUTH — reemplaza name, description y status; patient_id no cambia",
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
              schema: { $ref: "#/components/schemas/ClinicalRecordUpdate" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      patch: {
        tags: ["ClinicalRecords"],
        summary: "Actualizar historia clínica (PATCH — parcial)",
        description: "SIN AUTH — name, description y/o status; patient_id no cambia",
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
              schema: { $ref: "#/components/schemas/ClinicalRecordPatch" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      delete: {
        tags: ["ClinicalRecords"],
        summary: "Eliminar historia clínica (físico)",
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
    "/api/clinical-records/{id}/deactivate": {
      patch: {
        tags: ["ClinicalRecords"],
        summary: "Eliminar historia clínica (lógico)",
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
    "/api/clinical-records/patient/{patientId}": {
      get: {
        tags: ["ClinicalRecords"],
        summary: "Obtener la historia clínica de un paciente",
        description: "SIN AUTH — PDF: GET /historias/:pacienteId",
        security: [],
        parameters: [
          {
            name: "patientId",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": {
            description: "Historia clínica del paciente",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    clinical_record: { $ref: "#/components/schemas/ClinicalRecord" },
                  },
                },
              },
            },
          },
          "404": { description: "El paciente no tiene historia clínica" },
        },
      },
    },
  },
  components: {
    schemas: {
      ClinicalRecord: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Historia clínica — Ana Pérez" },
          description: {
            type: "string",
            example: "Sin antecedentes patológicos relevantes",
            nullable: true,
          },
          patient_id: { type: "integer", example: 1 },
          status: { type: "string", enum: ["active", "inactive"], example: "active" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      ClinicalRecordCreate: {
        type: "object",
        required: ["name", "patient_id"],
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          patient_id: { type: "integer" },
          status: { type: "string", enum: ["active", "inactive"], default: "active" },
        },
      },
      ClinicalRecordUpdate: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
      ClinicalRecordPatch: {
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
