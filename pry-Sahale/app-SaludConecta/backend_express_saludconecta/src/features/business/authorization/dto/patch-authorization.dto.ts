import { UpdateAuthorizationDto } from "./update-authorization.dto";

/** Datos de entrada de `PATCH /api/authorizations/:id` (actualización parcial). */
export type PatchAuthorizationDto = Partial<UpdateAuthorizationDto>;
