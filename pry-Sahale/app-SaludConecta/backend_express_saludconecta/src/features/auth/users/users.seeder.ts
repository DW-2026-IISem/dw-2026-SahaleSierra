import { User } from "./user.model";
import { faker } from "@faker-js/faker";

/**
 * Seeder de usuarios (`users`).
 *
 * Crea **cinco usuarios canónicos**, uno por rol, que sostienen toda la
 * demostración de RBAC:
 *
 * | username      | password          | rol (asignado en `role_users`) |
 * |---------------|-------------------|--------------------------------|
 * | `admin`       | `Admin123!`       | ADMIN                          |
 * | `admisiones`  | `Admisiones123!`  | ADMISIONES                     |
 * | `medico`      | `Medico123!`      | MEDICO                         |
 * | `facturacion` | `Facturacion123!` | FACTURACION                    |
 * | `auditor`     | `Auditor123!`     | AUDITOR_CLINICO                |
 *
 * Si `count > 5`, se añaden usuarios aleatorios (sin rol asignado): sirven para
 * comprobar que **estar autenticado no basta**: recibirán 403 en todo.
 *
 * Las contraseñas se guardan como **hash**: las hashea el hook `beforeCreate` del
 * modelo. Idempotente por `username`.
 */
export const SEED_USERS = [
  { username: "admin", email: "admin@saludconecta.local", password: "Admin123!" },
  { username: "admisiones", email: "admisiones@saludconecta.local", password: "Admisiones123!" },
  { username: "medico", email: "medico@saludconecta.local", password: "Medico123!" },
  { username: "facturacion", email: "facturacion@saludconecta.local", password: "Facturacion123!" },
  { username: "auditor", email: "auditor@saludconecta.local", password: "Auditor123!" },
] as const;

export async function seedUsers(count: number): Promise<number> {
  if (count <= 0) {
    console.log("⏭️  users: count=0, se omite");
    return 0;
  }

  let created = 0;

  for (const item of SEED_USERS) {
    const [user, wasCreated] = await User.findOrCreate({
      where: { username: item.username },
      defaults: {
        username: item.username,
        email: item.email,
        password: item.password,
        avatar: null,
        status: "active",
      },
    });
    if (wasCreated) {
      created++;
      continue;
    }
    // Reconciliación: igual que los seeders de roles y recursos, el de usuarios
    // **reactiva** los canónicos si quedaron inactivos. Así `npm run db:seed`
    // devuelve siempre el laboratorio a un estado operable.
    if (user.status !== "active") {
      await user.update({ status: "active" });
    }
  }

  // Los aleatorios solo se crean hasta completar `count` usuarios en total, para
  // que repetir `npm run db:seed` no siga añadiendo filas.
  const existing = await User.count();
  const extras = Math.max(0, count - existing);
  for (let i = 0; i < extras; i++) {
    const username = `user.${i}.${faker.string.alphanumeric(6)}`.toLowerCase();
    await User.create({
      username,
      email: `${username}@example.com`,
      password: "Password123!",
      avatar: null,
      status: "active",
    });
    created++;
  }

  console.log(
    `✅ users: insertados ${created} usuario(s) (${SEED_USERS.length} canónicos + ${extras} aleatorios)`
  );
  return created;
}
