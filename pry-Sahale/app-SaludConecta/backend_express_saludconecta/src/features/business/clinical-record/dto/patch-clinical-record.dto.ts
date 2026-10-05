import { UpdateClinicalRecordDto } from "./update-clinical-record.dto";

/** Datos de entrada de `PATCH /api/clinical-records/:id` (actualización parcial). */
export type PatchClinicalRecordDto = Partial<UpdateClinicalRecordDto>;
