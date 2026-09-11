import { Patient } from '../../../domain/entities/patient.entity.js';
import { PatientMapper } from '../../../application/mappers/patient.mapper.js';
import { PatientResponseDto } from '../../../application/dto/patient-response.dto.js';

export class PatientSerializer {
  static one(entity: Patient): PatientResponseDto {
    return PatientMapper.toResponse(entity);
  }

  static many(entities: Patient[]): PatientResponseDto[] {
    return entities.map(PatientMapper.toResponse);
  }
}
