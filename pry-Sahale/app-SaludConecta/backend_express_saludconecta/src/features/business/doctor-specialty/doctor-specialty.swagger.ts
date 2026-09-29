/**
 * Documentación OpenAPI del feature DoctorSpecialty (tabla doctor_specialties).
 * Se agrega desde `src/swagger` (registry externo), no se monta aquí.
 *
 * Leyenda: endpoints documentados como SIN AUTH (sin middleware JWT).
 */

export const doctorSpecialtySwagger = {
  tags: [
    {
      name: "DoctorSpecialties",
      description:
        "CRUD de la relación N:M Doctor↔Specialty (tabla doctor_specialties) — **SIN AUTH** (sin middleware JWT)",
    },
  ],
  paths: {
    "/api/doctor-specialties": {
      get: {
        tags: ["DoctorSpecialties"],
        summary: "Listar relaciones médico-especialidad activas",
        description: "SIN AUTH — retorna doctor_specialties con status=active",
        security: [],
        responses: {
          "200": {
            description: "Lista de relaciones",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    doctor_specialties: {
                      type: "array",
                      items: { $ref: "#/components/schemas/DoctorSpecialty" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["DoctorSpecialties"],
        summary: "Asignar especialidad a un médico",
        description:
          "SIN AUTH — médico y especialidad deben existir y estar active; el par (doctor_id, specialty_id) no puede repetirse",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/DoctorSpecialtyCreate" },
            },
          },
        },
        responses: {
          "201": {
            description: "Relación creada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    doctor_specialty: { $ref: "#/components/schemas/DoctorSpecialty" },
                  },
                },
              },
            },
          },
          "400": { description: "Validación (padres inactivos o par repetido)" },
          "404": { description: "Médico o especialidad no encontrado" },
        },
      },
    },
    "/api/doctor-specialties/{id}": {
      get: {
        tags: ["DoctorSpecialties"],
        summary: "Obtener relación por id",
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
            description: "Relación encontrada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    doctor_specialty: { $ref: "#/components/schemas/DoctorSpecialty" },
                  },
                },
              },
            },
          },
          "404": { description: "No encontrado" },
        },
      },
      put: {
        tags: ["DoctorSpecialties"],
        summary: "Actualizar relación (PUT)",
        description:
          "SIN AUTH — reemplaza relation_data y status; el par doctor/specialty no cambia",
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
              schema: { $ref: "#/components/schemas/DoctorSpecialtyUpdate" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "400": { description: "Padres inactivos al reactivar" },
          "404": { description: "No encontrado" },
        },
      },
      patch: {
        tags: ["DoctorSpecialties"],
        summary: "Actualizar relación (PATCH — parcial)",
        description: "SIN AUTH — relation_data y/o status",
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
              schema: { $ref: "#/components/schemas/DoctorSpecialtyPatch" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "400": { description: "Padres inactivos al reactivar" },
          "404": { description: "No encontrado" },
        },
      },
      delete: {
        tags: ["DoctorSpecialties"],
        summary: "Eliminar relación (físico)",
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
    "/api/doctor-specialties/{id}/deactivate": {
      patch: {
        tags: ["DoctorSpecialties"],
        summary: "Eliminar relación (lógico)",
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
      DoctorSpecialty: {
        type: "object",
        description: "Pivote N:M Doctor↔Specialty (tabla doctor_specialties)",
        properties: {
          id: { type: "integer", example: 1 },
          doctor_id: { type: "integer", example: 1 },
          specialty_id: { type: "integer", example: 1 },
          relation_data: {
            type: "string",
            example: "Especialidad principal",
            nullable: true,
          },
          status: { type: "string", enum: ["active", "inactive"], example: "active" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      DoctorSpecialtyCreate: {
        type: "object",
        required: ["doctor_id", "specialty_id"],
        properties: {
          doctor_id: { type: "integer" },
          specialty_id: { type: "integer" },
          relation_data: { type: "string" },
          status: { type: "string", enum: ["active", "inactive"], default: "active" },
        },
      },
      DoctorSpecialtyUpdate: {
        type: "object",
        properties: {
          relation_data: { type: "string" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
      DoctorSpecialtyPatch: {
        type: "object",
        properties: {
          relation_data: { type: "string" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
    },
  },
};
