import { UpdatePatientDto } from "./update-patient.dto";

/** Datos de entrada de `PATCH /api/patients/:id` (actualización parcial). */
export type PatchPatientDto = Partial<UpdatePatientDto>;
