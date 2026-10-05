import { Service, ServiceI } from "../service.model";

/** Respuesta HTTP de un servicio: todos los atributos del modelo. */
export type ServiceResponseDto = ServiceI;

/** Mapper modelo -> DTO de respuesta (objeto plano). */
export function toServiceResponse(service: Service): ServiceResponseDto {
  return service.toJSON() as ServiceResponseDto;
}
