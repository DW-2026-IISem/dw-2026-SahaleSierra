import { DoctorSpecialty } from '../../../domain/entities/doctor-specialty.entity.js';
import { DoctorSpecialtyMapper } from '../../../application/mappers/doctor-specialty.mapper.js';
import { DoctorSpecialtyResponseDto } from '../../../application/dto/doctor-specialty-response.dto.js';

export class DoctorSpecialtySerializer {
  static one(entity: DoctorSpecialty): DoctorSpecialtyResponseDto {
    return DoctorSpecialtyMapper.toResponse(entity);
  }

  static many(entities: DoctorSpecialty[]): DoctorSpecialtyResponseDto[] {
    return entities.map(DoctorSpecialtyMapper.toResponse);
  }
}
