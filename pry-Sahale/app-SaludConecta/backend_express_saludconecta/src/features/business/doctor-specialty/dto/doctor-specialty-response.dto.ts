import { DoctorSpecialty, DoctorSpecialtyI } from "../doctor-specialty.model";

/** Respuesta HTTP de una relación médico-especialidad. */
export type DoctorSpecialtyResponseDto = DoctorSpecialtyI;

/** Mapper modelo -> DTO de respuesta (objeto plano). */
export function toDoctorSpecialtyResponse(
  doctorSpecialty: DoctorSpecialty
): DoctorSpecialtyResponseDto {
  return doctorSpecialty.toJSON() as DoctorSpecialtyResponseDto;
}
