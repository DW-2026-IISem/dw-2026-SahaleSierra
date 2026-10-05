import { Agenda, AgendaI } from "../agenda.model";

/** Respuesta HTTP de una agenda: todos los atributos del modelo. */
export type AgendaResponseDto = AgendaI;

/** Mapper modelo -> DTO de respuesta (objeto plano). */
export function toAgendaResponse(agenda: Agenda): AgendaResponseDto {
  return agenda.toJSON() as AgendaResponseDto;
}
