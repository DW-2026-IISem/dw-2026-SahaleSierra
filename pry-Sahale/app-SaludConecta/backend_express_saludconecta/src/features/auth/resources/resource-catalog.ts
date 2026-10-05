/**
 * Catálogo de los **111 recursos** del sistema (fuente única).
 *
 * Un recurso es un par `(method, path)`; un permiso es la concesión de un
 * recurso a un rol. Este archivo es la definición en código del catálogo que
 * puebla el seeder de `resources` y del que se derivan las concesiones de los
 * roles: `ADMIN` recibe los 111; cada rol operativo, los recursos que lo
 * nombran en `roles`.
 *
 * Composición:
 *
 * | Grupo                                        | Recursos |
 * |----------------------------------------------|---------:|
 * | Pacientes                                    |        7 |
 * | Especialidades                               |        7 |
 * | Médicos                                      |        7 |
 * | Relaciones médico-especialidad               |        7 |
 * | Servicios                                    |        7 |
 * | Agendas                                      |        7 |
 * | Citas                                        |        7 |
 * | Historias clínicas                           |        8 |
 * | Autorizaciones                               |        7 |
 * | Atenciones                                   |        7 |
 * | Facturas                                     |        7 |
 * | Usuarios (+ cambio de contraseña + permisos) |        9 |
 * | Roles                                        |        7 |
 * | Recursos                                     |        7 |
 * | Asignaciones usuario-rol                     |        5 |
 * | Concesiones rol-recurso                      |        5 |
 * | **Total**                                    |  **111** |
 *
 * Reparto por rol (roles del proyecto SaludConecta):
 *
 * | Rol               | Recursos | Alcance |
 * |-------------------|---------:|---------|
 * | `ADMIN`           |      111 | todo el catálogo (negocio + seguridad) |
 * | `ADMISIONES`      |       25 | pacientes, citas y autorizaciones; lectura de catálogos |
 * | `MEDICO`          |       21 | historias clínicas y atenciones; lectura de agenda y citas |
 * | `FACTURACION`     |       15 | facturas; lectura de atenciones, citas y servicios |
 * | `AUDITOR_CLINICO` |       15 | solo lectura de datos asistenciales |
 *
 * Los datos asistenciales (`clinical-records`, `encounters`) son más
 * restrictivos que agenda y facturación: solo `MEDICO` los escribe y solo
 * `MEDICO` y `AUDITOR_CLINICO` leen historias clínicas. Borrar y desactivar es
 * exclusivo de `ADMIN` en todo el catálogo.
 *
 * Nota: las operaciones de sesión (`/api/session/*` y `/api/sessions/*`) **no**
 * son recursos RBAC. Son las modalidades OPEN y JWT: no dependen de la matriz
 * de permisos, sino de poseer (o no) una identidad válida.
 */

/** Roles operativos (todos menos `ADMIN`, que recibe el catálogo completo). */
export type OperationalRole = "ADMISIONES" | "MEDICO" | "FACTURACION" | "AUDITOR_CLINICO";

export const OPERATIONAL_ROLES: readonly OperationalRole[] = [
  "ADMISIONES",
  "MEDICO",
  "FACTURACION",
  "AUDITOR_CLINICO",
];

export interface CatalogResource {
  method: string;
  path: string;
  description: string;
  /** Roles operativos que reciben esta concesión (`ADMIN` la recibe siempre). */
  roles?: readonly OperationalRole[];
}

export const RESOURCE_CATALOG: readonly CatalogResource[] = [
  // ── Pacientes (7) ────────────────────────────────────────────
  {
    method: "GET",
    path: "/api/patients",
    description: "Listar pacientes",
    roles: ["ADMISIONES", "MEDICO", "FACTURACION", "AUDITOR_CLINICO"],
  },
  {
    method: "GET",
    path: "/api/patients/:id",
    description: "Consultar paciente",
    roles: ["ADMISIONES", "MEDICO", "FACTURACION", "AUDITOR_CLINICO"],
  },
  { method: "POST", path: "/api/patients", description: "Crear paciente", roles: ["ADMISIONES"] },
  {
    method: "PUT",
    path: "/api/patients/:id",
    description: "Reemplazar paciente",
    roles: ["ADMISIONES"],
  },
  {
    method: "PATCH",
    path: "/api/patients/:id",
    description: "Modificar paciente",
    roles: ["ADMISIONES"],
  },
  { method: "DELETE", path: "/api/patients/:id", description: "Eliminar paciente" },
  { method: "PATCH", path: "/api/patients/:id/deactivate", description: "Desactivar paciente" },

  // ── Especialidades (7) ───────────────────────────────────────
  {
    method: "GET",
    path: "/api/specialties",
    description: "Listar especialidades",
    roles: ["ADMISIONES"],
  },
  {
    method: "GET",
    path: "/api/specialties/:id",
    description: "Consultar especialidad",
    roles: ["ADMISIONES"],
  },
  { method: "POST", path: "/api/specialties", description: "Crear especialidad" },
  { method: "PUT", path: "/api/specialties/:id", description: "Reemplazar especialidad" },
  { method: "PATCH", path: "/api/specialties/:id", description: "Modificar especialidad" },
  { method: "DELETE", path: "/api/specialties/:id", description: "Eliminar especialidad" },
  {
    method: "PATCH",
    path: "/api/specialties/:id/deactivate",
    description: "Desactivar especialidad",
  },

  // ── Médicos (7) ──────────────────────────────────────────────
  {
    method: "GET",
    path: "/api/doctors",
    description: "Listar médicos",
    roles: ["ADMISIONES", "AUDITOR_CLINICO"],
  },
  {
    method: "GET",
    path: "/api/doctors/:id",
    description: "Consultar médico",
    roles: ["ADMISIONES", "AUDITOR_CLINICO"],
  },
  { method: "POST", path: "/api/doctors", description: "Crear médico" },
  { method: "PUT", path: "/api/doctors/:id", description: "Reemplazar médico" },
  { method: "PATCH", path: "/api/doctors/:id", description: "Modificar médico" },
  { method: "DELETE", path: "/api/doctors/:id", description: "Eliminar médico" },
  { method: "PATCH", path: "/api/doctors/:id/deactivate", description: "Desactivar médico" },

  // ── Relaciones médico-especialidad (7) ───────────────────────
  {
    method: "GET",
    path: "/api/doctor-specialties",
    description: "Listar relaciones médico-especialidad",
    roles: ["ADMISIONES"],
  },
  {
    method: "GET",
    path: "/api/doctor-specialties/:id",
    description: "Consultar relación médico-especialidad",
    roles: ["ADMISIONES"],
  },
  {
    method: "POST",
    path: "/api/doctor-specialties",
    description: "Crear relación médico-especialidad",
  },
  {
    method: "PUT",
    path: "/api/doctor-specialties/:id",
    description: "Reemplazar relación médico-especialidad",
  },
  {
    method: "PATCH",
    path: "/api/doctor-specialties/:id",
    description: "Modificar relación médico-especialidad",
  },
  {
    method: "DELETE",
    path: "/api/doctor-specialties/:id",
    description: "Eliminar relación médico-especialidad",
  },
  {
    method: "PATCH",
    path: "/api/doctor-specialties/:id/deactivate",
    description: "Desactivar relación médico-especialidad",
  },

  // ── Servicios (7) ────────────────────────────────────────────
  {
    method: "GET",
    path: "/api/services",
    description: "Listar servicios",
    roles: ["ADMISIONES", "MEDICO", "FACTURACION", "AUDITOR_CLINICO"],
  },
  {
    method: "GET",
    path: "/api/services/:id",
    description: "Consultar servicio",
    roles: ["ADMISIONES", "MEDICO", "FACTURACION", "AUDITOR_CLINICO"],
  },
  { method: "POST", path: "/api/services", description: "Crear servicio" },
  { method: "PUT", path: "/api/services/:id", description: "Reemplazar servicio" },
  { method: "PATCH", path: "/api/services/:id", description: "Modificar servicio" },
  { method: "DELETE", path: "/api/services/:id", description: "Eliminar servicio" },
  { method: "PATCH", path: "/api/services/:id/deactivate", description: "Desactivar servicio" },

  // ── Agendas (7) ──────────────────────────────────────────────
  {
    method: "GET",
    path: "/api/agendas",
    description: "Listar agendas",
    roles: ["ADMISIONES", "MEDICO"],
  },
  {
    method: "GET",
    path: "/api/agendas/:id",
    description: "Consultar agenda",
    roles: ["ADMISIONES", "MEDICO"],
  },
  { method: "POST", path: "/api/agendas", description: "Crear agenda" },
  { method: "PUT", path: "/api/agendas/:id", description: "Reemplazar agenda" },
  { method: "PATCH", path: "/api/agendas/:id", description: "Modificar agenda" },
  { method: "DELETE", path: "/api/agendas/:id", description: "Eliminar agenda" },
  { method: "PATCH", path: "/api/agendas/:id/deactivate", description: "Desactivar agenda" },

  // ── Citas (7) ────────────────────────────────────────────────
  {
    method: "GET",
    path: "/api/appointments",
    description: "Listar citas",
    roles: ["ADMISIONES", "MEDICO", "FACTURACION", "AUDITOR_CLINICO"],
  },
  {
    method: "GET",
    path: "/api/appointments/:id",
    description: "Consultar cita",
    roles: ["ADMISIONES", "MEDICO", "FACTURACION", "AUDITOR_CLINICO"],
  },
  { method: "POST", path: "/api/appointments", description: "Crear cita", roles: ["ADMISIONES"] },
  {
    method: "PUT",
    path: "/api/appointments/:id",
    description: "Reemplazar cita",
    roles: ["ADMISIONES"],
  },
  {
    method: "PATCH",
    path: "/api/appointments/:id",
    description: "Modificar cita",
    roles: ["ADMISIONES"],
  },
  { method: "DELETE", path: "/api/appointments/:id", description: "Eliminar cita" },
  { method: "PATCH", path: "/api/appointments/:id/deactivate", description: "Desactivar cita" },

  // ── Historias clínicas (8) ───────────────────────────────────
  {
    method: "GET",
    path: "/api/clinical-records",
    description: "Listar historias clínicas",
    roles: ["MEDICO", "AUDITOR_CLINICO"],
  },
  {
    method: "GET",
    path: "/api/clinical-records/:id",
    description: "Consultar historia clínica",
    roles: ["MEDICO", "AUDITOR_CLINICO"],
  },
  {
    method: "GET",
    path: "/api/clinical-records/patient/:patientId",
    description: "Consultar la historia clínica de un paciente",
    roles: ["MEDICO", "AUDITOR_CLINICO"],
  },
  {
    method: "POST",
    path: "/api/clinical-records",
    description: "Crear historia clínica",
    roles: ["MEDICO"],
  },
  {
    method: "PUT",
    path: "/api/clinical-records/:id",
    description: "Reemplazar historia clínica",
    roles: ["MEDICO"],
  },
  {
    method: "PATCH",
    path: "/api/clinical-records/:id",
    description: "Modificar historia clínica",
    roles: ["MEDICO"],
  },
  { method: "DELETE", path: "/api/clinical-records/:id", description: "Eliminar historia clínica" },
  {
    method: "PATCH",
    path: "/api/clinical-records/:id/deactivate",
    description: "Desactivar historia clínica",
  },

  // ── Autorizaciones (7) ───────────────────────────────────────
  {
    method: "GET",
    path: "/api/authorizations",
    description: "Listar autorizaciones",
    roles: ["ADMISIONES", "MEDICO", "FACTURACION", "AUDITOR_CLINICO"],
  },
  {
    method: "GET",
    path: "/api/authorizations/:id",
    description: "Consultar autorización",
    roles: ["ADMISIONES", "MEDICO", "FACTURACION", "AUDITOR_CLINICO"],
  },
  {
    method: "POST",
    path: "/api/authorizations",
    description: "Crear autorización",
    roles: ["ADMISIONES"],
  },
  {
    method: "PUT",
    path: "/api/authorizations/:id",
    description: "Reemplazar autorización",
    roles: ["ADMISIONES"],
  },
  {
    method: "PATCH",
    path: "/api/authorizations/:id",
    description: "Modificar autorización",
    roles: ["ADMISIONES"],
  },
  { method: "DELETE", path: "/api/authorizations/:id", description: "Eliminar autorización" },
  {
    method: "PATCH",
    path: "/api/authorizations/:id/deactivate",
    description: "Desactivar autorización",
  },

  // ── Atenciones (7) ───────────────────────────────────────────
  {
    method: "GET",
    path: "/api/encounters",
    description: "Listar atenciones",
    roles: ["MEDICO", "FACTURACION", "AUDITOR_CLINICO"],
  },
  {
    method: "GET",
    path: "/api/encounters/:id",
    description: "Consultar atención",
    roles: ["MEDICO", "FACTURACION", "AUDITOR_CLINICO"],
  },
  { method: "POST", path: "/api/encounters", description: "Crear atención", roles: ["MEDICO"] },
  {
    method: "PUT",
    path: "/api/encounters/:id",
    description: "Reemplazar atención",
    roles: ["MEDICO"],
  },
  {
    method: "PATCH",
    path: "/api/encounters/:id",
    description: "Modificar atención",
    roles: ["MEDICO"],
  },
  { method: "DELETE", path: "/api/encounters/:id", description: "Eliminar atención" },
  { method: "PATCH", path: "/api/encounters/:id/deactivate", description: "Desactivar atención" },

  // ── Facturas (7) ─────────────────────────────────────────────
  { method: "GET", path: "/api/invoices", description: "Listar facturas", roles: ["FACTURACION"] },
  {
    method: "GET",
    path: "/api/invoices/:id",
    description: "Consultar factura",
    roles: ["FACTURACION"],
  },
  { method: "POST", path: "/api/invoices", description: "Crear factura", roles: ["FACTURACION"] },
  {
    method: "PUT",
    path: "/api/invoices/:id",
    description: "Reemplazar factura",
    roles: ["FACTURACION"],
  },
  {
    method: "PATCH",
    path: "/api/invoices/:id",
    description: "Modificar factura",
    roles: ["FACTURACION"],
  },
  { method: "DELETE", path: "/api/invoices/:id", description: "Eliminar factura" },
  { method: "PATCH", path: "/api/invoices/:id/deactivate", description: "Desactivar factura" },

  // ── Usuarios (+ cambio de contraseña + permisos) (9) ─────────
  { method: "GET", path: "/api/users", description: "Listar usuarios" },
  { method: "GET", path: "/api/users/:id", description: "Consultar usuario" },
  { method: "POST", path: "/api/users", description: "Crear usuario" },
  { method: "PUT", path: "/api/users/:id", description: "Reemplazar usuario" },
  { method: "PATCH", path: "/api/users/:id", description: "Modificar usuario" },
  { method: "DELETE", path: "/api/users/:id", description: "Eliminar usuario" },
  { method: "PATCH", path: "/api/users/:id/deactivate", description: "Desactivar usuario" },
  {
    method: "PATCH",
    path: "/api/users/:id/password",
    description: "Cambiar contraseña de usuario",
  },
  {
    method: "GET",
    path: "/api/users/:id/permissions",
    description: "Consultar permisos efectivos del usuario",
  },

  // ── Roles (7) ────────────────────────────────────────────────
  { method: "GET", path: "/api/roles", description: "Listar roles" },
  { method: "GET", path: "/api/roles/:id", description: "Consultar rol" },
  { method: "POST", path: "/api/roles", description: "Crear rol" },
  { method: "PUT", path: "/api/roles/:id", description: "Reemplazar rol" },
  { method: "PATCH", path: "/api/roles/:id", description: "Modificar rol" },
  { method: "DELETE", path: "/api/roles/:id", description: "Eliminar rol" },
  { method: "PATCH", path: "/api/roles/:id/deactivate", description: "Desactivar rol" },

  // ── Recursos (7) ─────────────────────────────────────────────
  { method: "GET", path: "/api/resources", description: "Listar recursos" },
  { method: "GET", path: "/api/resources/:id", description: "Consultar recurso" },
  { method: "POST", path: "/api/resources", description: "Crear recurso" },
  { method: "PUT", path: "/api/resources/:id", description: "Reemplazar recurso" },
  { method: "PATCH", path: "/api/resources/:id", description: "Modificar recurso" },
  { method: "DELETE", path: "/api/resources/:id", description: "Eliminar recurso" },
  { method: "PATCH", path: "/api/resources/:id/deactivate", description: "Desactivar recurso" },

  // ── Asignaciones usuario ↔ rol (5) ───────────────────────────
  { method: "GET", path: "/api/role-users", description: "Listar asignaciones usuario-rol" },
  { method: "GET", path: "/api/role-users/:id", description: "Consultar asignación usuario-rol" },
  { method: "POST", path: "/api/role-users", description: "Asignar rol a usuario" },
  { method: "PATCH", path: "/api/role-users/:id/deactivate", description: "Retirar rol a usuario" },
  {
    method: "PATCH",
    path: "/api/role-users/:id/reactivate",
    description: "Reactivar rol a usuario",
  },

  // ── Concesiones rol ↔ recurso (5) ────────────────────────────
  { method: "GET", path: "/api/resource-roles", description: "Listar concesiones rol-recurso" },
  {
    method: "GET",
    path: "/api/resource-roles/:id",
    description: "Consultar concesión rol-recurso",
  },
  { method: "POST", path: "/api/resource-roles", description: "Conceder recurso a rol" },
  {
    method: "PATCH",
    path: "/api/resource-roles/:id/deactivate",
    description: "Retirar recurso a rol",
  },
  {
    method: "PATCH",
    path: "/api/resource-roles/:id/reactivate",
    description: "Reactivar recurso a rol",
  },
];

/** Recursos que recibe un rol operativo. Derivado del catálogo, no duplicado. */
export function resourcesForRole(role: OperationalRole): readonly CatalogResource[] {
  return RESOURCE_CATALOG.filter((resource) => resource.roles?.includes(role) === true);
}
