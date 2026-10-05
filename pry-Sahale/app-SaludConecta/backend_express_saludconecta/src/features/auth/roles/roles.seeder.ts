import { Role } from "./role.model";

/**
 * Seeder del catálogo de roles (`roles`).
 *
 * Crea los cinco roles de referencia de SaludConecta (los que define el
 * proyecto). Es determinista (no usa datos aleatorios) e idempotente:
 * `findOrCreate` por nombre y reactivación si ya existía inactivo.
 *
 * Los roles nacen **sin permisos**: las concesiones las crea el seeder de
 * `resource_roles` (`ADMIN` recibe todo el catálogo; cada rol operativo, los
 * recursos que lo nombran en `resource-catalog.ts`).
 */
export const SEED_ROLES = [
  {
    name: "ADMIN",
    description: "Administración del sistema: gestiona usuarios, roles, permisos y todo el negocio",
  },
  {
    name: "ADMISIONES",
    description: "Admisiones: registra pacientes, agenda citas y gestiona autorizaciones",
  },
  {
    name: "MEDICO",
    description: "Profesional de salud: registra atenciones e historias clínicas",
  },
  {
    name: "FACTURACION",
    description: "Facturación: emite facturas a partir de las atenciones",
  },
  {
    name: "AUDITOR_CLINICO",
    description: "Auditoría clínica: solo lectura de historias clínicas y atenciones",
  },
] as const;

export async function seedRoles(): Promise<number> {
  let created = 0;

  for (const item of SEED_ROLES) {
    const [role, wasCreated] = await Role.findOrCreate({
      where: { name: item.name },
      defaults: { name: item.name, description: item.description, status: "active" },
    });

    if (wasCreated) {
      created++;
      continue;
    }
    if (role.status !== "active") {
      await role.update({ status: "active" });
    }
  }

  console.log(`✅ roles: catálogo reconciliado (${SEED_ROLES.length} roles, ${created} nuevos)`);
  return created;
}
