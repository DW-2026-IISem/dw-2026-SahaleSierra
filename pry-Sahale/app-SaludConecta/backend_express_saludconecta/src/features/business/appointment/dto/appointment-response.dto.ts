import { Appointment, AppointmentI } from "../appointment.model";
import { AgendaI } from "../../agenda/agenda.model";
import { PatientI } from "../../patient/patient.model";

/**
 * Respuesta HTTP de una cita.
 *
 * En las lecturas (`getAll`, `getOne`) incluye el resumen de la agenda y del
 * paciente; en las escrituras solo los atributos de la cita.
 */
export interface AppointmentResponseDto extends AppointmentI {
  agenda?: AgendaI | null;
  patient?: PatientI | null;
}

/** Mapper modelo -> DTO de respuesta (objeto plano, con relaciones si vienen). */
export function toAppointmentResponse(appointment: Appointment): AppointmentResponseDto {
  return appointment.toJSON() as AppointmentResponseDto;
}
