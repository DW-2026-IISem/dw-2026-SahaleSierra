import { Resource, ResourceI } from "../resource.model";

/**
 * Respuesta HTTP de un recurso. `resources` no tiene campos internos, así que el
 * DTO coincide con el modelo; se declara igualmente para que la API quede
 * desacoplada del modelo (cambiar el modelo no cambia el contrato por accidente).
 */
export type ResourceResponseDto = ResourceI;

/** Mapper modelo -> DTO de respuesta (objeto plano). */
export function toResourceResponse(resource: Resource): ResourceResponseDto {
  return resource.toJSON() as ResourceI;
}
