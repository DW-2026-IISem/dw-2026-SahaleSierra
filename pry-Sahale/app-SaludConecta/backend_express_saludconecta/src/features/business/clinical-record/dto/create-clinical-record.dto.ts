/**
 * Datos de entrada de `POST /api/clinical-records`.
 *
 * El paciente debe existir, estar activo y no tener ya una historia (1:1).
 */
export interface CreateClinicalRecordDto {
  name: string;
  description?: string | null;
  patient_id: number;
  status?: "active" | "inactive";
}
