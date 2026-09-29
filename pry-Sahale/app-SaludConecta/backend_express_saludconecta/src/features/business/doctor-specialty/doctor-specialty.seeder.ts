import { faker } from "@faker-js/faker";
import { DoctorSpecialty } from "./doctor-specialty.model";
import { Doctor } from "../doctor/doctor.model";
import { Specialty } from "../specialty/specialty.model";

/**
 * Seeder del feature DoctorSpecialty (tabla `doctor_specialties`).
 * Se invoca desde `src/database/seeders` (SeedersRunner), no desde la App.
 *
 * Requiere médicos y especialidades activos. Genera pares únicos
 * (doctor_id, specialty_id). Idempotente: si ya hay filas, omite.
 */
export async function seedDoctorSpecialties(count: number): Promise<number> {
  if (count <= 0) {
    console.log("⏭️  doctor_specialties: count=0, se omite");
    return 0;
  }

  const existing = await DoctorSpecialty.count();
  if (existing > 0) {
    console.log(`⏭️  doctor_specialties: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const doctors = await Doctor.findAll({ where: { status: "active" } });
  const specialties = await Specialty.findAll({ where: { status: "active" } });

  if (doctors.length === 0 || specialties.length === 0) {
    console.log("⏭️  doctor_specialties: faltan médicos o especialidades activos, se omite seeder");
    return 0;
  }

  const pairs: Array<{ doctor_id: number; specialty_id: number }> = [];
  for (const doctor of doctors) {
    for (const specialty of specialties) {
      pairs.push({ doctor_id: doctor.id, specialty_id: specialty.id });
    }
  }

  const selected = faker.helpers.shuffle(pairs).slice(0, count);

  const rows = selected.map((pair) => ({
    doctor_id: pair.doctor_id,
    specialty_id: pair.specialty_id,
    relation_data: faker.helpers.arrayElement([
      "Especialidad principal",
      "Especialidad secundaria",
    ]),
    status: "active" as const,
  }));

  await DoctorSpecialty.bulkCreate(rows);
  console.log(`✅ doctor_specialties: insertados ${rows.length} registro(s) falsos`);
  return rows.length;
}
