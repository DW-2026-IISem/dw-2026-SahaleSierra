import { faker } from "@faker-js/faker";
import { Specialty } from "./specialty.model";

/**
 * Seeder del feature Specialty (datos falsos con @faker-js/faker).
 * Se invoca desde `src/database/seeders` (SeedersRunner), no desde la App.
 *
 * Usa una lista fija de especialidades médicas reales (faker no las genera)
 * y toma `count` nombres sin repetir. Idempotente: si ya hay filas, no inserta.
 */
const MEDICAL_SPECIALTIES: string[] = [
  "Medicina General",
  "Pediatría",
  "Cardiología",
  "Dermatología",
  "Ginecología y Obstetricia",
  "Medicina Interna",
  "Neurología",
  "Oftalmología",
  "Ortopedia y Traumatología",
  "Otorrinolaringología",
  "Psiquiatría",
  "Psicología",
  "Endocrinología",
  "Gastroenterología",
  "Neumología",
  "Nefrología",
  "Urología",
  "Reumatología",
  "Nutrición y Dietética",
  "Fisioterapia",
];

export async function seedSpecialties(count: number): Promise<number> {
  if (count <= 0) {
    console.log("⏭️  specialties: count=0, se omite");
    return 0;
  }

  const existing = await Specialty.count();
  if (existing > 0) {
    console.log(`⏭️  specialties: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const total = Math.min(count, MEDICAL_SPECIALTIES.length);
  const names = faker.helpers.arrayElements(MEDICAL_SPECIALTIES, total);

  const rows = names.map((name) => ({
    name,
    description: `Consulta ambulatoria de ${name.toLowerCase()}`,
    status: "active" as const,
  }));

  await Specialty.bulkCreate(rows);
  console.log(`✅ specialties: insertados ${total} registro(s) falsos`);
  return total;
}
