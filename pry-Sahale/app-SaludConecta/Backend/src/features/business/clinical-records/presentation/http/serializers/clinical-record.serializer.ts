import { ClinicalRecord } from '../../../domain/entities/clinical-record.entity.js';
import { ClinicalRecordMapper } from '../../../application/mappers/clinical-record.mapper.js';
import { ClinicalRecordResponseDto } from '../../../application/dto/clinical-record-response.dto.js';

export class ClinicalRecordSerializer {
  static one(entity: ClinicalRecord): ClinicalRecordResponseDto {
    return ClinicalRecordMapper.toResponse(entity);
  }

  static many(entities: ClinicalRecord[]): ClinicalRecordResponseDto[] {
    return entities.map(ClinicalRecordMapper.toResponse);
  }
}
