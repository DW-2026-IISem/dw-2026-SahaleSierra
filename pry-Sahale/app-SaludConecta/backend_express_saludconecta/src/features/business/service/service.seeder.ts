import { faker } from "@faker-js/faker";
import { Service } from "./service.model";

/**
 * Seeder del feature Service (datos falsos con @faker-js/faker).
 * Se invoca desde `src/database/seeders` (SeedersRunner), no desde la App.
 *
 * Usa una lista fija de servicios ambulatorios (faker no los genera)
 * y toma `count` nombres sin repetir. Idempotente: si ya hay filas, no inserta.
 */
const AMBULATORY_SERVICES: string[] = [
  "Consulta de medicina general",
  "Consulta especializada",
  "Consulta de control",
  "Electrocardiograma",
  "Ecografía",
  "Toma de muestras de laboratorio",
  "Curación",
  "Vacunación",
  "Control prenatal",
  "Terapia física",
  "Espirometría",
  "Citología",
  "Inyectología",
  "Consulta de nutrición",
  "Consulta de psicología",
];

export async function seedServices(count: number): Promise<number> {
  if (count <= 0) {
    console.log("⏭️  services: count=0, se omite");
    return 0;
  }

  const existing = await Service.count();
  if (existing > 0) {
    console.log(`⏭️  services: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const total = Math.min(count, AMBULATORY_SERVICES.length);
  const names = faker.helpers.arrayElements(AMBULATORY_SERVICES, total);

  const rows = names.map((name) => ({
    name,
    description: `Servicio ambulatorio: ${name.toLowerCase()}`,
    status: "active" as const,
  }));

  await Service.bulkCreate(rows);
  console.log(`✅ services: insertados ${total} registro(s) falsos`);
  return total;
}
