import { Doctor } from '../../domain/entities/doctor.entity.js';
import { DoctorModel } from '../../infrastructure/persistence/models/doctor.model.js';
import { DoctorResponseDto } from '../dto/doctor-response.dto.js';

export class DoctorMapper {
  static toDomain(model: DoctorModel): Doctor {
    return Doctor.reconstitute({
      id: model.id,
      name: model.name,
      description: model.description,
      status: model.status as Doctor['status'],
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toPersistence(entity: Doctor): Partial<DoctorModel> {
    return {
      name: entity.name,
      description: entity.description,
      status: entity.status,
    } as Partial<DoctorModel>;
  }

  static toResponse(entity: Doctor): DoctorResponseDto {
    return {
      id: entity.id!,
      name: entity.name,
      description: entity.description,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
