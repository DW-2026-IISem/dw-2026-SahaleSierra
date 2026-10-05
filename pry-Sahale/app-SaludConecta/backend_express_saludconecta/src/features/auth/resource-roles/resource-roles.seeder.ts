import { Resource } from "../resources/resource.model";
import { Role } from "../roles/role.model";
import {
  OPERATIONAL_ROLES,
  RESOURCE_CATALOG,
  resourcesForRole,
} from "../resources/resource-catalog";
import { ResourceRolesService } from "./resource-roles.service";

/**
 * Seeder de las concesiones rol ↔ recurso (`resource_roles`). **Es el que
 * construye la matriz de permisos.**
 *
 * Reparto de referencia (definido en `resource-catalog.ts`):
 *  - `ADMIN`  -> **todo** el catálogo (administración total).
 *  - cada rol operativo (`ADMISIONES`, `MEDICO`, `FACTURACION`,
 *    `AUDITOR_CLINICO`) -> los recursos que lo nombran en `roles`.
 *
 * Como `reconcileRole` es determinista, reejecutar el seeder **reconcilia** el
 * catálogo: concede lo que falte, reactiva lo inactivo y retira lo que sobre.
 * Así ningún rol acumula permisos por accidente.
 */
export async function seedResourceRoles(): Promise<number> {
  const service = new ResourceRolesService();

  const resources = await Resource.findAll({ where: { status: "active" } });
  const idByOperation = new Map(
    resources.map((resource) => [`${resource.method} ${resource.path}`, resource.id])
  );

  /** Traduce el catálogo en código a los `resource_id` reales de la base. */
  const idsFor = (catalog: ReadonlyArray<{ method: string; path: string }>): number[] =>
    catalog
      .map((item) => idByOperation.get(`${item.method} ${item.path}`))
      .filter((id): id is number => typeof id === "number");

  const plan: Array<{ roleName: string; ids: number[] }> = [
    { roleName: "ADMIN", ids: idsFor(RESOURCE_CATALOG) },
    ...OPERATIONAL_ROLES.map((roleName) => ({
      roleName,
      ids: idsFor(resourcesForRole(roleName)),
    })),
  ];

  let total = 0;

  for (const item of plan) {
    const role = await Role.findOne({ where: { name: item.roleName } });
    if (!role) {
      console.log(`⏭️  resource_roles: no existe el rol ${item.roleName}, se omite`);
      continue;
    }
    const result = await service.reconcileRole(role.id, item.ids);
    console.log(
      `✅ resource_roles: ${item.roleName} -> ${result.total_active} recursos ` +
        `(${result.activated} altas, ${result.deactivated} bajas)`
    );
    total += result.total_active;
  }

  return total;
}
