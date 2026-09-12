import { Encounter } from '../../domain/entities/encounter.entity.js';
import { EncounterModel } from '../../infrastructure/persistence/models/encounter.model.js';
import { EncounterResponseDto } from '../dto/encounter-response.dto.js';

export class EncounterMapper {
  static toDomain(model: EncounterModel): Encounter {
    return Encounter.reconstitute({
      id: model.id,
      appointmentId: model.appointmentId,
      serviceId: model.serviceId,
      clinicalRecordId: model.clinicalRecordId,
      startDate: model.startDate,
      endDate: model.endDate,
      total: Number(model.total),
      observations: model.observations,
      status: model.status as Encounter['status'],
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toPersistence(entity: Encounter): Partial<EncounterModel> {
    return {
      appointmentId: entity.appointmentId,
      serviceId: entity.serviceId,
      clinicalRecordId: entity.clinicalRecordId,
      startDate: entity.startDate,
      endDate: entity.endDate,
      total: entity.total,
      observations: entity.observations,
      status: entity.status,
    } as Partial<EncounterModel>;
  }

  static toResponse(entity: Encounter): EncounterResponseDto {
    return {
      id: entity.id!,
      appointmentId: entity.appointmentId,
      serviceId: entity.serviceId,
      clinicalRecordId: entity.clinicalRecordId,
      startDate: entity.startDate,
      endDate: entity.endDate,
      total: entity.total,
      observations: entity.observations,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
