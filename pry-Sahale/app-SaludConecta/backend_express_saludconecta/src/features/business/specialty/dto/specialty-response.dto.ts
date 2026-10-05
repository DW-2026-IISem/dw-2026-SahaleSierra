import { Specialty, SpecialtyI } from "../specialty.model";

/** Respuesta HTTP de una especialidad: todos los atributos del modelo. */
export type SpecialtyResponseDto = SpecialtyI;

/** Mapper modelo -> DTO de respuesta (objeto plano). */
export function toSpecialtyResponse(specialty: Specialty): SpecialtyResponseDto {
  return specialty.toJSON() as SpecialtyResponseDto;
}
