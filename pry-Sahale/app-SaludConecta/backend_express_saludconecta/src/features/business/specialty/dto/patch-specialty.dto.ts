import { UpdateSpecialtyDto } from "./update-specialty.dto";

/** Datos de entrada de `PATCH /api/specialties/:id` (actualización parcial). */
export type PatchSpecialtyDto = Partial<UpdateSpecialtyDto>;
