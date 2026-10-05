import { Application } from "express";
import swaggerUi from "swagger-ui-express";
import { patientSwagger } from "../features/business/patient/patient.swagger";
import { specialtySwagger } from "../features/business/specialty/specialty.swagger";
import { doctorSwagger } from "../features/business/doctor/doctor.swagger";
import { doctorSpecialtySwagger } from "../features/business/doctor-specialty/doctor-specialty.swagger";
import { serviceSwagger } from "../features/business/service/service.swagger";
import { agendaSwagger } from "../features/business/agenda/agenda.swagger";
import { appointmentSwagger } from "../features/business/appointment/appointment.swagger";
import { clinicalRecordSwagger } from "../features/business/clinical-record/clinical-record.swagger";
import { authorizationSwagger } from "../features/business/authorization/authorization.swagger";
import { encounterSwagger } from "../features/business/encounter/encounter.swagger";
import { invoiceSwagger } from "../features/business/invoice/invoice.swagger";
import { usersSwagger } from "../features/auth/users/users.swagger";
import { rolesSwagger } from "../features/auth/roles/roles.swagger";
import { resourcesSwagger } from "../features/auth/resources/resources.swagger";
import { roleUsersSwagger } from "../features/auth/role-users/role-users.swagger";
import { resourceRolesSwagger } from "../features/auth/resource-roles/resource-roles.swagger";
import {
  bearerSecurityScheme,
  forbiddenResponse,
  unauthorizedResponse,
} from "../shared/http/swagger-security";




export type FeatureSwaggerModule = {
  tags: unknown[];
  paths: Record<string, unknown>;
  components?: { schemas?: Record<string, unknown> };
};

/**
 * Registry externo: importa la documentación OpenAPI de cada feature
 * (mismo patrón que SeedersRunner).
 */
const featureSwaggerModules: FeatureSwaggerModule[] = [
  usersSwagger, 
  rolesSwagger,
  resourcesSwagger,
  roleUsersSwagger,
  resourceRolesSwagger,
  patientSwagger,
  specialtySwagger,
  doctorSwagger,
  doctorSpecialtySwagger,
  serviceSwagger,
  agendaSwagger,
  appointmentSwagger,
  clinicalRecordSwagger,
  authorizationSwagger,
  encounterSwagger,
  invoiceSwagger,

];

export function buildOpenApiDocument() {
  const tags: unknown[] = [];
  const paths: Record<string, unknown> = {};
  const schemas: Record<string, unknown> = {};

  for (const mod of featureSwaggerModules) {
    tags.push(...mod.tags);
    Object.assign(paths, mod.paths);
    if (mod.components?.schemas) {
      Object.assign(schemas, mod.components.schemas);
    }
  }

  return {
    openapi: "3.0.3",
    info: {
      title: "SaludConecta API",
      version: "1.0.0",
      description:
        "API SaludConecta — centro médico ambulatorio (Express + Sequelize). Los endpoints de Patient están documentados como **SIN AUTH**. Todas las rutas business son **SIN AUTH** en este lab.",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 4000}`,
        description: "Local",
      },
    ],
    tags,
    paths,
    // Postura *secure by default*: cualquier operación que no declare su propio
    // `security` exige el access token. Los endpoints OPEN (login/refresh/logout)
    // lo anulan explícitamente con `security: []`.
    security: [{ bearerAuth: [] }],
    components: {
      // Esquema único de seguridad: `Authorization: Bearer <access_token>` (RFC 6750).
      securitySchemes: bearerSecurityScheme,
      // Respuestas reutilizables (referenciables con `$ref`).
      responses: {
        Unauthorized: unauthorizedResponse,
        Forbidden: forbiddenResponse,
      },
      schemas,
    },
  };
}

/** Monta Swagger UI y el JSON OpenAPI */
export function setupSwagger(app: Application): void {
  const document = buildOpenApiDocument();
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(document));
  app.get("/api/docs.json", (_req, res) => {
    res.json(document);
  });
  console.log("📘 Swagger UI: /api/docs  |  OpenAPI JSON: /api/docs.json");
}
