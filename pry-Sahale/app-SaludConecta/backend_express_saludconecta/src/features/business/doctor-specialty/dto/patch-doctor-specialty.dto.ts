import { UpdateDoctorSpecialtyDto } from "./update-doctor-specialty.dto";

/** Datos de entrada de `PATCH /api/doctor-specialties/:id` (actualización parcial). */
export type PatchDoctorSpecialtyDto = Partial<UpdateDoctorSpecialtyDto>;
