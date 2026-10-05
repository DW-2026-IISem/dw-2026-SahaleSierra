import { Encounter, EncounterI } from "../encounter.model";
import { AppointmentI } from "../../appointment/appointment.model";
import { ClinicalRecordI } from "../../clinical-record/clinical-record.model";
import { ServiceI } from "../../service/service.model";

/**
 * Respuesta HTTP de una atención.
 *
 * En las lecturas (`getAll`, `getOne`) incluye la cita, la historia clínica y
 * el servicio; en las escrituras solo los atributos de la atención.
 */
export interface EncounterResponseDto extends EncounterI {
  appointment?: AppointmentI | null;
  clinical_record?: ClinicalRecordI | null;
  service?: ServiceI | null;
}

/** Mapper modelo -> DTO de respuesta (objeto plano, con relaciones si vienen). */
export function toEncounterResponse(encounter: Encounter): EncounterResponseDto {
  return encounter.toJSON() as EncounterResponseDto;
}
