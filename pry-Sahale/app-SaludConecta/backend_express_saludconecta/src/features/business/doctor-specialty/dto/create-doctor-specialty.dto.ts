/**
 * Datos de entrada de `POST /api/doctor-specialties` — asignar una
 * especialidad a un médico.
 *
 * Médico y especialidad deben existir y estar activos; el par
 * `(doctor_id, specialty_id)` no puede repetirse.
 */
export interface CreateDoctorSpecialtyDto {
  doctor_id: number;
  specialty_id: number;
  relation_data?: string | null;
  status?: "active" | "inactive";
}
