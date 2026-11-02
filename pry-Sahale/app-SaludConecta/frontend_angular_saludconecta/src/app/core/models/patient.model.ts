import { Status, Timestamps } from './api.model';

/** Tabla `patients` — /api/patients. `document_number` es único. */
export interface Patient extends Timestamps {
  id: number;
  document_type: string; // 'CC', 'TI', …
  document_number: string;
  name: string;
  birth_date: string; // DATEONLY: 'YYYY-MM-DD'
  contact: string;
  status: Status;
}

export interface PatientPayload {
  document_type: string;
  document_number: string;
  name: string;
  birth_date: string;
  contact: string;
  status?: Status;
}
