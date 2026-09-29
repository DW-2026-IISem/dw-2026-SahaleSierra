import { faker } from "@faker-js/faker";
import { Appointment } from "./appointment.model";
import { Agenda } from "../agenda/agenda.model";
import { Doctor } from "../doctor/doctor.model";
import { Patient } from "../patient/patient.model";

/**
 * Seeder del feature Appointment (citas).
 * Se invoca desde `src/database/seeders` (SeedersRunner), no desde la App.
 *
 * Requiere agendas activas (con médico activo) y pacientes activos.
 * Reparte las citas en franjas de 30 min por agenda (sin cruces), desde mañana 08:00.
 * Todas quedan en state = "scheduled". Idempotente: si ya hay filas, no inserta.
 */
const REASONS: string[] = [
  "Consulta de control",
  "Dolor de cabeza persistente",
  "Revisión de exámenes de laboratorio",
  "Chequeo general",
  "Seguimiento de tratamiento",
  "Dolor abdominal",
  "Renovación de fórmula médica",
  "Valoración por primera vez",
];

export async function seedAppointments(count: number): Promise<number> {
  if (count <= 0) {
    console.log("⏭️  appointments: count=0, se omite");
    return 0;
  }

  const existing = await Appointment.count();
  if (existing > 0) {
    console.log(`⏭️  appointments: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const activeDoctors = await Doctor.findAll({ where: { status: "active" } });
  const activeDoctorIds = new Set(activeDoctors.map((d) => d.id));
  const agendas = (await Agenda.findAll({ where: { status: "active" } })).filter((a) =>
    activeDoctorIds.has(a.doctor_id)
  );
  const patients = await Patient.findAll({ where: { status: "active" } });

  if (agendas.length === 0 || patients.length === 0) {
    console.log("⏭️  appointments: faltan agendas o pacientes activos, se omite seeder");
    return 0;
  }

  const base = new Date();
  base.setDate(base.getDate() + 1);
  base.setHours(8, 0, 0, 0);
  const SLOT_MS = 30 * 60 * 1000;

  const rows = Array.from({ length: count }, (_, i) => {
    const agenda = agendas[i % agendas.length];
    const slot = Math.floor(i / agendas.length);
    const patient = patients[Math.floor(Math.random() * patients.length)];
    const start = new Date(base.getTime() + slot * SLOT_MS);
    const end = new Date(start.getTime() + SLOT_MS);
    return {
      start_date: start,
      end_date: end,
      reason: faker.helpers.arrayElement(REASONS),
      state: "scheduled" as const,
      agenda_id: agenda.id,
      patient_id: patient.id,
      status: "active" as const,
    };
  });

  await Appointment.bulkCreate(rows);
  console.log(`✅ appointments: insertados ${count} registro(s) falsos`);
  return count;
}
