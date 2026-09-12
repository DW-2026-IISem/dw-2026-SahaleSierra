import { Doctor } from '../../../domain/entities/doctor.entity.js';
import { DoctorMapper } from '../../../application/mappers/doctor.mapper.js';
import { DoctorResponseDto } from '../../../application/dto/doctor-response.dto.js';

export class DoctorSerializer {
  static one(entity: Doctor): DoctorResponseDto {
    return DoctorMapper.toResponse(entity);
  }

  static many(entities: Doctor[]): DoctorResponseDto[] {
    return entities.map(DoctorMapper.toResponse);
  }
}
