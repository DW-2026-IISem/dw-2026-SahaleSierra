import { RoleUser } from "./role-user.model";
import { Role } from "../roles/role.model";
import { User } from "../users/user.model";

/**
 * Seeder de las asignaciones usuario ↔ rol (`role_users`).
 *
 * Crea las cinco asignaciones de referencia (un usuario canónico por rol). Con
 * esto cada usuario hereda los recursos de su rol, sin escribir ni una fila de
 * autorización a mano.
 *
 * Idempotente: si la pareja ya existe (activa o no), se asegura de que quede
 * activa en lugar de duplicarla.
 */
export const SEED_ROLE_USERS = [
  { username: "admin", roleName: "ADMIN" },
  { username: "admisiones", roleName: "ADMISIONES" },
  { username: "medico", roleName: "MEDICO" },
  { username: "facturacion", roleName: "FACTURACION" },
  { username: "auditor", roleName: "AUDITOR_CLINICO" },
] as const;

export async function seedRoleUsers(): Promise<number> {
  let created = 0;

  for (const item of SEED_ROLE_USERS) {
    const user = await User.findOne({ where: { username: item.username } });
    const role = await Role.findOne({ where: { name: item.roleName } });

    if (!user || !role) {
      console.log(
        `⏭️  role_users: falta ${item.username} o ${item.roleName}, se omite esa asignación`
      );
      continue;
    }

    const [assignment, wasCreated] = await RoleUser.findOrCreate({
      where: { user_id: user.id, role_id: role.id },
      defaults: { user_id: user.id, role_id: role.id, status: "active" },
    });

    if (wasCreated) {
      created++;
      continue;
    }
    if (assignment.status !== "active") {
      await assignment.update({ status: "active" });
    }
  }

  console.log(
    `✅ role_users: asignaciones reconciliadas (${SEED_ROLE_USERS.length}, ${created} nuevas)`
  );
  return created;
}
