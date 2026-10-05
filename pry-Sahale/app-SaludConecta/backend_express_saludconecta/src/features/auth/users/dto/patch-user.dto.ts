import { UpdateUserDto } from "./update-user.dto";

/** Datos de entrada de `PATCH /api/users/:id` (actualización parcial). */
export type PatchUserDto = Partial<UpdateUserDto>;
