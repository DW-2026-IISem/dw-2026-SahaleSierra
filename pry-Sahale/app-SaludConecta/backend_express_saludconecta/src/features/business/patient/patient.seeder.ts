import { faker } from "@faker-js/faker";
import { Patient } from "./patient.model";

/**
 * Seeder del feature Patient (datos falsos con @faker-js/faker).
 * Se invoca desde `src/database/seeders` (SeedersRunner), no desde la App.
 *
 * Idempotente: si ya hay filas, no vuelve a insertar.
 */
export async function seedPatients(count: number): Promise<number> {
  if (count <= 0) {
    console.log("⏭️  patients: count=0, se omite");
    return 0;
  }

  const existing = await Patient.count();
  if (existing > 0) {
    console.log(`⏭️  patients: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const rows = Array.from({ length: count }, (_, i) => ({
    document_type: faker.helpers.arrayElement(["CC", "TI", "CE", "PA"]),
    document_number: `${faker.string.numeric(4)}${String(i).padStart(6, "0")}`,
    name: faker.person.fullName(),
    birth_date: faker.date
      .birthdate({ mode: "age", min: 0, max: 90 })
      .toISOString()
      .slice(0, 10),
    contact: faker.phone.number({ style: "national" }),
    status: "active" as const,
  }));

  await Patient.bulkCreate(rows);
  console.log(`✅ patients: insertados ${count} registro(s) falsos`);
  return count;
}
