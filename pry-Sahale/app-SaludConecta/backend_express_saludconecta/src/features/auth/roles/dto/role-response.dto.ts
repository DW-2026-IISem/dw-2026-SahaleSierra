import { Role, RoleI } from "../role.model";

/** Respuesta HTTP de un rol. Sin campos internos: el DTO coincide con el modelo. */
export type RoleResponseDto = RoleI;

/** Mapper modelo -> DTO de respuesta (objeto plano). */
export function toRoleResponse(role: Role): RoleResponseDto {
  return role.toJSON() as RoleI;
}
