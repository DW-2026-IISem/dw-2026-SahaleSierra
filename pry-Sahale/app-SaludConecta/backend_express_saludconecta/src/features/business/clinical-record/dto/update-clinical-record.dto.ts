/**
 * Datos de entrada de `PUT /api/clinical-records/:id`.
 *
 * `patient_id` no está aquí a propósito: la historia no cambia de paciente.
 */
export interface UpdateClinicalRecordDto {
  name: string;
  description?: string | null;
  status?: "active" | "inactive";
}
