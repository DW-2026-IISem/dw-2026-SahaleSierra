import { ClinicalRecord } from '../../domain/entities/clinical-record.entity.js';
import { ClinicalRecordModel } from '../../infrastructure/persistence/models/clinical-record.model.js';
import { ClinicalRecordResponseDto } from '../dto/clinical-record-response.dto.js';

export class ClinicalRecordMapper {
  static toDomain(model: ClinicalRecordModel): ClinicalRecord {
    return ClinicalRecord.reconstitute({
      id: model.id,
      patientId: model.patientId,
      name: model.name,
      description: model.description,
      status: model.status as ClinicalRecord['status'],
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toPersistence(entity: ClinicalRecord): Partial<ClinicalRecordModel> {
    return {
      patientId: entity.patientId,
      name: entity.name,
      description: entity.description,
      status: entity.status,
    } as Partial<ClinicalRecordModel>;
  }

  static toResponse(entity: ClinicalRecord): ClinicalRecordResponseDto {
    return {
      id: entity.id!,
      patientId: entity.patientId,
      name: entity.name,
      description: entity.description,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
