import { Status, Timestamps } from './api.model';

/** Tabla `clinical_records` — /api/clinical-records. 1:1 con `patients`. */
export interface ClinicalRecord extends Timestamps {
  id: number;
  name: string;
  description: string | null;
  patient_id: number;
  status: Status;
}

export interface ClinicalRecordPayload {
  name: string;
  patient_id: number;
  description?: string | null;
  status?: Status;
}

/** `patient_id` no cambia en PUT/PATCH. */
export type ClinicalRecordUpdatePayload = Partial<
  Omit<ClinicalRecordPayload, 'patient_id' | 'status'>
>;
