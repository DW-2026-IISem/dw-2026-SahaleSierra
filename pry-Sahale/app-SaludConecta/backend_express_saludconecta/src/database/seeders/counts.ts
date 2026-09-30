/**
 * Cantidad de registros por feature/entidad.
 * Prioridad: CLI (--patients=N) > env (SEED_PATIENTS) > default de este archivo.
 *
 * Cuando agregues features, suma aquí la clave y léela en el runner.
 */
export type SeedCounts = {
  patients: number;
  specialties: number;
  doctors: number;
  doctor_specialties: number;
  services: number;
  agendas: number;
  appointments: number;
  clinical_records: number;
  authorizations: number;
  encounters: number;
  invoices: number;

};

export const DEFAULT_SEED_COUNTS: SeedCounts = {
  patients: 10,
  specialties: 10,
  doctors: 15,
  doctor_specialties: 12,
  services: 10,
  agendas: 15,
  appointments: 20,
  clinical_records: 10, 
  authorizations: 8,
  encounters: 10,
  invoices: 5,

};

export function resolveSeedCounts(argv: string[] = process.argv.slice(2)): SeedCounts {
  const counts: SeedCounts = { ...DEFAULT_SEED_COUNTS };

  const envPatients = process.env.SEED_PATIENTS;
  if (envPatients !== undefined && envPatients !== "") {
    counts.patients = Number(envPatients);
  }
  
  const envSpecialties = process.env.SEED_SPECIALTIES;
  if (envSpecialties !== undefined && envSpecialties !== "") {
    counts.specialties = Number(envSpecialties);
  }

  const envDoctors = process.env.SEED_DOCTORS;
  if (envDoctors !== undefined && envDoctors !== "") {
    counts.doctors = Number(envDoctors);
  }
  
  const envDoctorSpecialties = process.env.SEED_DOCTOR_SPECIALTIES;
  if (envDoctorSpecialties !== undefined && envDoctorSpecialties !== "") {
    counts.doctor_specialties = Number(envDoctorSpecialties);
  }
  
  const envServices = process.env.SEED_SERVICES;
  if (envServices !== undefined && envServices !== "") {
    counts.services = Number(envServices);
  }
  
  const envAgendas = process.env.SEED_AGENDAS;
  if (envAgendas !== undefined && envAgendas !== "") {
    counts.agendas = Number(envAgendas);
  }

  const envAppointments = process.env.SEED_APPOINTMENTS;
  if (envAppointments !== undefined && envAppointments !== "") {
    counts.appointments = Number(envAppointments);
  }

  const envClinicalRecords = process.env.SEED_CLINICAL_RECORDS;
  if (envClinicalRecords !== undefined && envClinicalRecords !== "") {
    counts.clinical_records = Number(envClinicalRecords);
  }

  const envAuthorizations = process.env.SEED_AUTHORIZATIONS;
  if (envAuthorizations !== undefined && envAuthorizations !== "") {
    counts.authorizations = Number(envAuthorizations);
  }

  const envEncounters = process.env.SEED_ENCOUNTERS;
  if (envEncounters !== undefined && envEncounters !== "") {
    counts.encounters = Number(envEncounters);
  }

  const envInvoices = process.env.SEED_INVOICES;
  if (envInvoices !== undefined && envInvoices !== "") {
    counts.invoices = Number(envInvoices);
  }


  for (const arg of argv) {
    const m = arg.match(/^--([a-zA-Z_]+)=(\d+)$/);
    if (!m) continue;
    const key = m[1] as keyof SeedCounts;
    const value = Number(m[2]);
    if (key in counts) {
      counts[key] = value;
    }
  }

  return counts;
}
