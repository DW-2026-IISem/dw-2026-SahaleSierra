import { Patient, PatientI } from "../patient.model";

/**
 * Respuesta HTTP de un paciente.
 *
 * Patient no tiene campos sensibles, así que la respuesta lleva todos los
 * atributos del modelo. El service nunca devuelve la instancia de Sequelize:
 * siempre pasa por este mapper.
 */
export type PatientResponseDto = PatientI;

/** Mapper modelo -> DTO de respuesta (objeto plano). */
export function toPatientResponse(patient: Patient): PatientResponseDto {
  return patient.toJSON() as PatientResponseDto;
}
