import {
  bearerSecurity,
  forbiddenResponse,
  unauthorizedResponse,
} from "../../../shared/http/swagger-security";

/**
 * Documentación OpenAPI del feature Invoice (tabla invoices).
 * Se agrega desde `src/swagger` (registry externo), no se monta aquí.
 *
 * Leyenda: endpoints documentados como JWT + RBAC.
 */

export const invoiceSwagger = {
  tags: [
    {
      name: "Invoices",
      description: "Facturas: agrupan atenciones facturables — **JWT + RBAC**",
    },
  ],
  paths: {
    "/api/invoices": {
      get: {
        tags: ["Invoices"],
        summary: "Listar facturas activas",
        description: "JWT + RBAC — retorna invoices con status=active",
        security: bearerSecurity,
        responses: {
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "200": {
            description: "Lista de facturas",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    invoices: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Invoice" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Invoices"],
        summary: "Crear factura",
        description: "JWT + RBAC — transaccional: number único; encounter_ids de atenciones activas, completed, sin factura y del mismo paciente. subtotal = suma de totales; total = subtotal + tax",
        security: bearerSecurity,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/InvoiceCreate" },
            },
          },
        },
        responses: {
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "201": {
            description: "Factura creada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    invoice: { $ref: "#/components/schemas/Invoice" },
                  },
                },
              },
            },
          },
          "400": { description: "Validación (number repetido, atenciones no facturables o de distintos pacientes)" },
          "404": { description: "Atención no encontrada" },
        },
      },
    },
    "/api/invoices/{id}": {
      get: {
        tags: ["Invoices"],
        summary: "Obtener factura por id",
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
            description: "Factura encontrada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    invoice: { $ref: "#/components/schemas/Invoice" },
                  },
                },
              },
            },
          },
          "404": { description: "No encontrado" },
        },
      },
      put: {
        tags: ["Invoices"],
        summary: "Actualizar factura (PUT — reemplazo)",
        description: "JWT + RBAC — cabecera; total = subtotal + tax",
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
              schema: { $ref: "#/components/schemas/InvoiceUpdate" },
            },
          },
        },
        responses: {
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "200": { description: "Actualizado" },
          "400": { description: "tax inválido" },
          "404": { description: "No encontrado" },
        },
      },
      patch: {
        tags: ["Invoices"],
        summary: "Actualizar factura (PATCH — parcial)",
        description: "JWT + RBAC — cabecera parcial; si cambia tax se recalcula total",
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
              schema: { $ref: "#/components/schemas/InvoicePatch" },
            },
          },
        },
        responses: {
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "200": { description: "Actualizado" },
          "400": { description: "tax inválido" },
          "404": { description: "No encontrado" },
        },
      },
      delete: {
        tags: ["Invoices"],
        summary: "Eliminar factura (físico)",
        description: "JWT + RBAC — libera las atenciones (invoice_id = null) y borra la factura",
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
    "/api/invoices/{id}/deactivate": {
      patch: {
        tags: ["Invoices"],
        summary: "Eliminar factura (lógico)",
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
      Invoice: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          number: { type: "string", example: "FV-100001" },
          invoice_date: { type: "string", format: "date-time" },
          subtotal: { type: "number", example: 85000 },
          tax: { type: "number", example: 0 },
          total: { type: "number", example: 85000 },
          state: { type: "string", enum: ["issued", "paid", "cancelled"], example: "issued" },
          status: { type: "string", enum: ["active", "inactive"], example: "active" },
          encounters: {
            type: "array",
            items: { $ref: "#/components/schemas/Encounter" },
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      InvoiceCreate: {
        type: "object",
        required: ["number", "encounter_ids"],
        properties: {
          number: { type: "string" },
          invoice_date: { type: "string", format: "date-time" },
          tax: { type: "number", default: 0 },
          state: { type: "string", enum: ["issued", "paid", "cancelled"], default: "issued" },
          status: { type: "string", enum: ["active", "inactive"], default: "active" },
          encounter_ids: {
            type: "array",
            items: { type: "integer" },
            example: [1, 2],
          },
        },
      },
      InvoiceUpdate: {
        type: "object",
        properties: {
          number: { type: "string" },
          invoice_date: { type: "string", format: "date-time" },
          tax: { type: "number" },
          state: { type: "string", enum: ["issued", "paid", "cancelled"] },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
      InvoicePatch: {
        type: "object",
        properties: {
          number: { type: "string" },
          invoice_date: { type: "string", format: "date-time" },
          tax: { type: "number" },
          state: { type: "string", enum: ["issued", "paid", "cancelled"] },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
    },
  },
};
