import { DoctorSpecialty } from '../../domain/entities/doctor-specialty.entity.js';
import { DoctorSpecialtyModel } from '../../infrastructure/persistence/models/doctor-specialty.model.js';
import { DoctorSpecialtyResponseDto } from '../dto/doctor-specialty-response.dto.js';

export class DoctorSpecialtyMapper {
  static toDomain(model: DoctorSpecialtyModel): DoctorSpecialty {
    return DoctorSpecialty.reconstitute({
      id: model.id,
      doctorId: model.doctorId,
      specialtyId: model.specialtyId,
      relationData: model.relationData,
      status: model.status as DoctorSpecialty['status'],
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toPersistence(entity: DoctorSpecialty): Partial<DoctorSpecialtyModel> {
    return {
      doctorId: entity.doctorId,
      specialtyId: entity.specialtyId,
      relationData: entity.relationData,
      status: entity.status,
    } as Partial<DoctorSpecialtyModel>;
  }

  static toResponse(entity: DoctorSpecialty): DoctorSpecialtyResponseDto {
    return {
      id: entity.id!,
      doctorId: entity.doctorId,
      specialtyId: entity.specialtyId,
      relationData: entity.relationData,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
