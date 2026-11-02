import { Status, Timestamps } from './api.model';

/** Pivote `doctor_specialties` — /api/doctor-specialties. El par es único. */
export interface DoctorSpecialty extends Timestamps {
  id: number;
  doctor_id: number;
  specialty_id: number;
  status: Status;
}

export interface DoctorSpecialtyPayload {
  doctor_id: number;
  specialty_id: number;
  status?: Status;
}
