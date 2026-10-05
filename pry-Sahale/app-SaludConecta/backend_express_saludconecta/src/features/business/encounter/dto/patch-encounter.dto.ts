import { UpdateEncounterDto } from "./update-encounter.dto";

/** Datos de entrada de `PATCH /api/encounters/:id` (actualización parcial). */
export type PatchEncounterDto = Partial<UpdateEncounterDto>;
