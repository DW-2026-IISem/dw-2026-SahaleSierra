/**
 * Datos de entrada de `PUT /api/doctor-specialties/:id`.
 *
 * `doctor_id` y `specialty_id` no están aquí a propósito: el par no cambia.
 * Para asignar otra especialidad se da de baja esta relación y se crea otra.
 */
export interface UpdateDoctorSpecialtyDto {
  relation_data?: string | null;
  status?: "active" | "inactive";
}
