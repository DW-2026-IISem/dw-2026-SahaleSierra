import { Doctor, DoctorI } from "../doctor.model";

/** Respuesta HTTP de un médico: todos los atributos del modelo. */
export type DoctorResponseDto = DoctorI;

/** Mapper modelo -> DTO de respuesta (objeto plano). */
export function toDoctorResponse(doctor: Doctor): DoctorResponseDto {
  return doctor.toJSON() as DoctorResponseDto;
}
