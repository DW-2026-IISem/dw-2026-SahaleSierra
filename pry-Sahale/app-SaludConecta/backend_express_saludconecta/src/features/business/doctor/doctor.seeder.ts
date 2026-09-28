import { faker } from "@faker-js/faker";
import { Doctor } from "./doctor.model";

/**
 * Seeder del feature Doctor (datos falsos con @faker-js/faker).
 * Se invoca desde `src/database/seeders` (SeedersRunner), no desde la App.
 *
 * Idempotente: si ya hay filas, no vuelve a insertar.
 */
export async function seedDoctors(count: number): Promise<number> {
  if (count <= 0) {
    console.log("⏭️  doctors: count=0, se omite");
    return 0;
  }

  const existing = await Doctor.count();
  if (existing > 0) {
    console.log(`⏭️  doctors: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const rows = Array.from({ length: count }, () => ({
    name: `Dr(a). ${faker.person.fullName()}`,
    description: `Médico de consulta externa, ${faker.number.int({ min: 1, max: 30 })} años de experiencia`,
    status: "active" as const,
  }));

  await Doctor.bulkCreate(rows);
  console.log(`✅ doctors: insertados ${count} registro(s) falsos`);
  return count;
}
