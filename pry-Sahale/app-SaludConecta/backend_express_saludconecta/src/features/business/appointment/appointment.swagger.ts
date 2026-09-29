/**
 * Documentación OpenAPI del feature Appointment (tabla appointments).
 * Se agrega desde `src/swagger` (registry externo), no se monta aquí.
 *
 * Leyenda: endpoints documentados como SIN AUTH (sin middleware JWT).
 */

export const appointmentSwagger = {
  tags: [
    {
      name: "Appointments",
      description: "CRUD de citas (agenda + paciente) — **SIN AUTH** (sin middleware JWT)",
    },
  ],
  paths: {
    "/api/appointments": {
      get: {
        tags: ["Appointments"],
        summary: "Listar citas activas",
        description: "SIN AUTH — retorna appointments con status=active",
        security: [],
        responses: {
          "200": {
            description: "Lista de citas",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    appointments: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Appointment" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Appointments"],
        summary: "Crear cita",
        description: "SIN AUTH — transaccional: agenda activa (médico activo), paciente activo, end_date > start_date y sin cruce de horario en la agenda. Siempre nace en state=scheduled",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AppointmentCreate" },
            },
          },
        },
        responses: {
          "201": {
            description: "Cita creada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    appointment: { $ref: "#/components/schemas/Appointment" },
                  },
                },
              },
            },
          },
          "400": { description: "Validación (padres inactivos, rango inválido o cruce de horario)" },
          "404": { description: "Agenda o paciente no encontrado" },
        },
      },
    },
    "/api/appointments/{id}": {
      get: {
        tags: ["Appointments"],
        summary: "Obtener cita por id",
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
            description: "Cita encontrada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    appointment: { $ref: "#/components/schemas/Appointment" },
                  },
                },
              },
            },
          },
          "404": { description: "No encontrado" },
        },
      },
      put: {
        tags: ["Appointments"],
        summary: "Actualizar cita (PUT — reemplazo)",
        description: "SIN AUTH — no permite state=attended (solo POST /api/encounters)",
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
              schema: { $ref: "#/components/schemas/AppointmentUpdate" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "400": { description: "Validación (state attended, rango o cruce de horario)" },
          "404": { description: "No encontrado" },
        },
      },
      patch: {
        tags: ["Appointments"],
        summary: "Actualizar cita (PATCH — parcial)",
        description: "SIN AUTH — no permite state=attended (solo POST /api/encounters)",
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
              schema: { $ref: "#/components/schemas/AppointmentPatch" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "400": { description: "Validación (state attended, rango o cruce de horario)" },
          "404": { description: "No encontrado" },
        },
      },
      delete: {
        tags: ["Appointments"],
        summary: "Eliminar cita (físico)",
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
    "/api/appointments/{id}/deactivate": {
      patch: {
        tags: ["Appointments"],
        summary: "Eliminar cita (lógico)",
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
      Appointment: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          start_date: { type: "string", format: "date-time" },
          end_date: { type: "string", format: "date-time" },
          reason: { type: "string", example: "Consulta de control", nullable: true },
          state: { type: "string", enum: ["scheduled", "attended", "cancelled"], example: "scheduled" },
          agenda_id: { type: "integer", example: 1 },
          patient_id: { type: "integer", example: 1 },
          status: { type: "string", enum: ["active", "inactive"], example: "active" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      AppointmentCreate: {
        type: "object",
        required: ["agenda_id", "patient_id", "start_date", "end_date"],
        properties: {
          agenda_id: { type: "integer" },
          patient_id: { type: "integer" },
          start_date: { type: "string", format: "date-time" },
          end_date: { type: "string", format: "date-time" },
          reason: { type: "string" },
          status: { type: "string", enum: ["active", "inactive"], default: "active" },
        },
      },
      AppointmentUpdate: {
        type: "object",
        properties: {
          agenda_id: { type: "integer" },
          patient_id: { type: "integer" },
          start_date: { type: "string", format: "date-time" },
          end_date: { type: "string", format: "date-time" },
          reason: { type: "string" },
          state: { type: "string", enum: ["scheduled", "cancelled"] },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
      AppointmentPatch: {
        type: "object",
        properties: {
          agenda_id: { type: "integer" },
          patient_id: { type: "integer" },
          start_date: { type: "string", format: "date-time" },
          end_date: { type: "string", format: "date-time" },
          reason: { type: "string" },
          state: { type: "string", enum: ["scheduled", "cancelled"] },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
    },
  },
};
