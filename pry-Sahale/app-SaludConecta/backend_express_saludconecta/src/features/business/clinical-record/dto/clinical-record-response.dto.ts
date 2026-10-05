import { ClinicalRecord, ClinicalRecordI } from "../clinical-record.model";

/** Respuesta HTTP de una historia clínica. */
export type ClinicalRecordResponseDto = ClinicalRecordI;

/** Mapper modelo -> DTO de respuesta (objeto plano). */
export function toClinicalRecordResponse(
  clinicalRecord: ClinicalRecord
): ClinicalRecordResponseDto {
  return clinicalRecord.toJSON() as ClinicalRecordResponseDto;
}
