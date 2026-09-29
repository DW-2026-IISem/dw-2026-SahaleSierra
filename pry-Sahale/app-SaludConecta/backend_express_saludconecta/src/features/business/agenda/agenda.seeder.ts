import { faker } from "@faker-js/faker";
import { Agenda } from "./agenda.model";
import { Doctor } from "../doctor/doctor.model";

/**
 * Seeder del feature Agenda (datos falsos con @faker-js/faker).
 * Se invoca desde `src/database/seeders` (SeedersRunner), no desde la App.
 *
 * Requiere médicos activos. Idempotente: si ya hay filas, no inserta.
 */
export async function seedAgendas(count: number): Promise<number> {
  if (count <= 0) {
    console.log("⏭️  agendas: count=0, se omite");
    return 0;
  }

  const existing = await Agenda.count();
  if (existing > 0) {
    console.log(`⏭️  agendas: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const doctors = await Doctor.findAll({ where: { status: "active" } });
  if (doctors.length === 0) {
    console.log("⏭️  agendas: no hay médicos activos, se omite seeder");
    return 0;
  }

  const rows = Array.from({ length: count }, () => {
    const doctor = doctors[Math.floor(Math.random() * doctors.length)];
    const shift = faker.helpers.arrayElement(["Mañana", "Tarde"]);
    const days = faker.helpers.arrayElement(["Lunes a viernes", "Martes y jueves", "Sábados"]);
    return {
      name: `Agenda ${shift} — ${doctor.name}`,
      description: `${days}, jornada de la ${shift.toLowerCase()}`,
      doctor_id: doctor.id,
      status: "active" as const,
    };
  });

  await Agenda.bulkCreate(rows);
  console.log(`✅ agendas: insertados ${count} registro(s) falsos`);
  return count;
}
