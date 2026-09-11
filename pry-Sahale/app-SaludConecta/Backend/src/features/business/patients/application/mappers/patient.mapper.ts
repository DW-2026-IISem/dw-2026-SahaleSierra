import { Patient } from '../../domain/entities/patient.entity.js';
import { PatientModel } from '../../infrastructure/persistence/models/patient.model.js';
import { PatientResponseDto } from '../dto/patient-response.dto.js';

export class PatientMapper {
  static toDomain(model: PatientModel): Patient {
    return Patient.reconstitute({
      id: model.id,
      documentType: model.documentType as Patient['documentType'],
      documentNumber: model.documentNumber,
      name: model.name,
      birthDate: model.birthDate,
      contact: model.contact,
      status: model.status as Patient['status'],
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toPersistence(entity: Patient): Partial<PatientModel> {
    return {
      documentType: entity.documentType,
      documentNumber: entity.documentNumber,
      name: entity.name,
      birthDate: entity.birthDate,
      contact: entity.contact,
      status: entity.status,
    } as Partial<PatientModel>;
  }

  static toResponse(entity: Patient): PatientResponseDto {
    return {
      id: entity.id!,
      documentType: entity.documentType,
      documentNumber: entity.documentNumber,
      name: entity.name,
      birthDate: entity.birthDate,
      contact: entity.contact,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
