import { faker } from "@faker-js/faker";
import { ClinicalRecord } from "./clinical-record.model";
import { Patient } from "../patient/patient.model";

/**
 * Seeder del feature ClinicalRecord (historias clínicas).
 * Se invoca desde `src/database/seeders` (SeedersRunner), no desde la App.
 *
 * Crea una historia por paciente activo (1:1), hasta `count`.
 * Idempotente: si ya hay filas, no inserta.
 */
const BACKGROUNDS: string[] = [
  "Sin antecedentes patológicos relevantes",
  "Antecedente de hipertensión arterial controlada",
  "Antecedente de asma en la infancia",
  "Antecedentes quirúrgicos: apendicectomía",
  "Antecedente familiar de diabetes",
  "Alergias no conocidas",
];

export async function seedClinicalRecords(count: number): Promise<number> {
  if (count <= 0) {
    console.log("⏭️  clinical_records: count=0, se omite");
    return 0;
  }

  const existing = await ClinicalRecord.count();
  if (existing > 0) {
    console.log(`⏭️  clinical_records: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const patients = await Patient.findAll({ where: { status: "active" } });
  if (patients.length === 0) {
    console.log("⏭️  clinical_records: no hay pacientes activos, se omite seeder");
    return 0;
  }

  const selected = faker.helpers.shuffle(patients).slice(0, count);

  const rows = selected.map((patient) => ({
    name: `Historia clínica — ${patient.name}`,
    description: faker.helpers.arrayElement(BACKGROUNDS),
    patient_id: patient.id,
    status: "active" as const,
  }));

  await ClinicalRecord.bulkCreate(rows);
  console.log(`✅ clinical_records: insertados ${rows.length} registro(s) falsos`);
  return rows.length;
}
