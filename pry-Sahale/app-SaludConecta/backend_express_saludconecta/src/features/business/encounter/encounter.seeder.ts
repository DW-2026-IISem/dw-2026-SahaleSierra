import { faker } from "@faker-js/faker";
import { Encounter } from "./encounter.model";
import { Appointment } from "../appointment/appointment.model";
import { Agenda } from "../agenda/agenda.model";
import { Doctor } from "../doctor/doctor.model";
import { Patient } from "../patient/patient.model";
import { ClinicalRecord } from "../clinical-record/clinical-record.model";
import { Service } from "../service/service.model";

/**
 * Seeder del feature Encounter (atenciones).
 * Se invoca desde `src/database/seeders` (SeedersRunner), no desde la App.
 *
 * Aplica la misma regla que el controller: solo atiende citas programadas cuyo
 * médico y paciente estén activos y cuyo paciente tenga historia clínica activa.
 * Cada atención creada deja la cita en "attended". Las atenciones quedan en
 * state = "completed" (facturables en ISS-15). Idempotente: si ya hay filas, omite.
 */
const OBSERVATIONS: string[] = [
  "Paciente estable, se dan recomendaciones generales",
  "Se ordenan exámenes de control",
  "Se ajusta tratamiento y se programa control en 30 días",
  "Sin hallazgos relevantes",
  "Se remite a especialista",
];

export async function seedEncounters(count: number): Promise<number> {
  if (count <= 0) {
    console.log("⏭️  encounters: count=0, se omite");
    return 0;
  }

  const existing = await Encounter.count();
  if (existing > 0) {
    console.log(`⏭️  encounters: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const services = await Service.findAll({ where: { status: "active" } });
  if (services.length === 0) {
    console.log("⏭️  encounters: no hay servicios activos, se omite seeder");
    return 0;
  }

  const appointments = faker.helpers.shuffle(
    await Appointment.findAll({ where: { status: "active", state: "scheduled" } })
  );

  let inserted = 0;
  for (const appointment of appointments) {
    if (inserted >= count) break;

    const agenda = await Agenda.findByPk(appointment.agenda_id);
    const doctor = agenda ? await Doctor.findByPk(agenda.doctor_id) : null;
    if (!doctor || doctor.status !== "active") continue;

    const patient = await Patient.findByPk(appointment.patient_id);
    if (!patient || patient.status !== "active") continue;

    const clinicalRecord = await ClinicalRecord.findOne({
      where: { patient_id: patient.id, status: "active" },
    });
    if (!clinicalRecord) continue;

    const service = services[Math.floor(Math.random() * services.length)];

    await Encounter.create({
      appointment_id: appointment.id,
      clinical_record_id: clinicalRecord.id,
      service_id: service.id,
      start_date: appointment.start_date,
      end_date: appointment.end_date,
      total: faker.number.int({ min: 30, max: 250 }) * 1000,
      state: "completed",
      observations: faker.helpers.arrayElement(OBSERVATIONS),
      status: "active",
    });
    await appointment.update({ state: "attended" });
    inserted++;
  }

  console.log(`✅ encounters: insertados ${inserted} registro(s) falsos`);
  return inserted;
}
