import { UpdateServiceDto } from "./update-service.dto";

/** Datos de entrada de `PATCH /api/services/:id` (actualización parcial). */
export type PatchServiceDto = Partial<UpdateServiceDto>;
