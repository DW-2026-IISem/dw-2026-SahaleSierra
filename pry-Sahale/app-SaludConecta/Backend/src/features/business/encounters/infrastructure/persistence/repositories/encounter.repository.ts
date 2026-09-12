import { Injectable } from '@nestjs/common';
import { Encounter } from '../../../domain/entities/encounter.entity.js';
import type {
  EncounterFilter,
  EncounterRepository as IEncounterRepository,
} from '../../../domain/interfaces/encounter-repository.interface.js';
import type { PaginationParams } from '../../../../../../common/interfaces/pagination.interface.js';
import { EncounterModel } from '../models/encounter.model.js';
import { EncounterMapper } from '../../../application/mappers/encounter.mapper.js';

@Injectable()
export class SequelizeEncounterRepository implements IEncounterRepository {
  async create(encounter: Encounter): Promise<Encounter> {
    const created = await EncounterModel.create(EncounterMapper.toPersistence(encounter));
    return EncounterMapper.toDomain(created);
  }

  async findById(id: number): Promise<Encounter | null> {
    const found = await EncounterModel.findByPk(id);
    return found ? EncounterMapper.toDomain(found) : null;
  }

  async findByAppointmentId(appointmentId: number): Promise<Encounter | null> {
    const found = await EncounterModel.findOne({ where: { appointmentId } });
    return found ? EncounterMapper.toDomain(found) : null;
  }

  async findAll(filter: EncounterFilter, pagination: PaginationParams) {
    const where: Record<string, unknown> = {};
    if (filter.appointmentId) where.appointmentId = filter.appointmentId;
    if (filter.serviceId) where.serviceId = filter.serviceId;
    if (filter.clinicalRecordId) where.clinicalRecordId = filter.clinicalRecordId;
    if (filter.status) where.status = filter.status;

    const { rows, count } = await EncounterModel.findAndCountAll({
      where,
      limit: pagination.limit,
      offset: (pagination.page - 1) * pagination.limit,
      order: [['id', 'DESC']],
    });

    return { data: rows.map(EncounterMapper.toDomain), total: count };
  }

  async update(id: number, encounter: Encounter): Promise<Encounter> {
    await EncounterModel.update(EncounterMapper.toPersistence(encounter), { where: { id } });
    const updated = await EncounterModel.findByPk(id);
    return EncounterMapper.toDomain(updated!);
  }

  async delete(id: number): Promise<void> {
    await EncounterModel.destroy({ where: { id } });
  }
}
