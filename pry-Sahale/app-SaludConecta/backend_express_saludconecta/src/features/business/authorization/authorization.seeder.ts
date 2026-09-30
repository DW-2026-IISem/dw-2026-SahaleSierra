import { faker } from "@faker-js/faker";
import { Authorization } from "./authorization.model";
import { Appointment } from "../appointment/appointment.model";

/**
 * Seeder del feature Authorization (autorizaciones).
 * Se invoca desde `src/database/seeders` (SeedersRunner), no desde la App.
 *
 * Una autorización por cita activa y programada (0..1:1), hasta `count`.
 * Idempotente: si ya hay filas, no inserta.
 */
const AGREEMENTS: string[] = ["EPS Salud Total", "EPS Sura", "Medicina prepagada", "Particular"];

export async function seedAuthorizations(count: number): Promise<number> {
  if (count <= 0) {
    console.log("⏭️  authorizations: count=0, se omite");
    return 0;
  }

  const existing = await Authorization.count();
  if (existing > 0) {
    console.log(`⏭️  authorizations: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const appointments = await Appointment.findAll({
    where: { status: "active", state: "scheduled" },
  });
  if (appointments.length === 0) {
    console.log("⏭️  authorizations: no hay citas programadas activas, se omite seeder");
    return 0;
  }

  const selected = faker.helpers.shuffle(appointments).slice(0, count);

  const rows = selected.map((appointment) => ({
    name: `AUT-${faker.string.numeric(8)}`,
    description: `Autorización ${faker.helpers.arrayElement(AGREEMENTS)}`,
    appointment_id: appointment.id,
    status: "active" as const,
  }));

  await Authorization.bulkCreate(rows);
  console.log(`✅ authorizations: insertados ${rows.length} registro(s) falsos`);
  return rows.length;
}
