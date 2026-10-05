import { UpdateDoctorDto } from "./update-doctor.dto";

/** Datos de entrada de `PATCH /api/doctors/:id` (actualización parcial). */
export type PatchDoctorDto = Partial<UpdateDoctorDto>;
