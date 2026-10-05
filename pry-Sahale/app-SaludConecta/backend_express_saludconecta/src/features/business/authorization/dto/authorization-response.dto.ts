import { Authorization, AuthorizationI } from "../authorization.model";

/** Respuesta HTTP de una autorización. */
export type AuthorizationResponseDto = AuthorizationI;

/** Mapper modelo -> DTO de respuesta (objeto plano). */
export function toAuthorizationResponse(authorization: Authorization): AuthorizationResponseDto {
  return authorization.toJSON() as AuthorizationResponseDto;
}
