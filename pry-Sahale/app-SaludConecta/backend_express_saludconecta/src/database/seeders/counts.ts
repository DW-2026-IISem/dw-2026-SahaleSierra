/**
 * Cantidad de registros por feature/entidad.
 * Prioridad: CLI (--patients=N) > env (SEED_PATIENTS) > default de este archivo.
 *
 * Cuando agregues features, suma aquí la clave y léela en el runner.
 */
export type SeedCounts = {
  patients: number;
  specialties: number;
  // doctors?: number;
  // doctor_specialties?: number;
};

export const DEFAULT_SEED_COUNTS: SeedCounts = {
  patients: 10,
  specialties: 10,
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
