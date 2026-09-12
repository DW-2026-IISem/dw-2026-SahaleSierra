import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { Agenda } from '../../../domain/entities/agenda.entity.js';
import type {
  AgendaFilter,
  AgendaRepository as IAgendaRepository,
} from '../../../domain/interfaces/agenda-repository.interface.js';
import type { PaginationParams } from '../../../../../../common/interfaces/pagination.interface.js';
import { AgendaModel } from '../models/agenda.model.js';
import { AgendaMapper } from '../../../application/mappers/agenda.mapper.js';

@Injectable()
export class SequelizeAgendaRepository implements IAgendaRepository {
  async create(agenda: Agenda): Promise<Agenda> {
    const created = await AgendaModel.create(AgendaMapper.toPersistence(agenda));
    return AgendaMapper.toDomain(created);
  }

  async findById(id: number): Promise<Agenda | null> {
    const found = await AgendaModel.findByPk(id);
    return found ? AgendaMapper.toDomain(found) : null;
  }

  async findAll(filter: AgendaFilter, pagination: PaginationParams) {
    const where: Record<string, unknown> = {};
    if (filter.doctorId) where.doctorId = filter.doctorId;
    if (filter.name) where.name = { [Op.like]: `%${filter.name}%` };
    if (filter.status) where.status = filter.status;

    const { rows, count } = await AgendaModel.findAndCountAll({
      where,
      limit: pagination.limit,
      offset: (pagination.page - 1) * pagination.limit,
      order: [['id', 'DESC']],
    });

    return { data: rows.map(AgendaMapper.toDomain), total: count };
  }

  async update(id: number, agenda: Agenda): Promise<Agenda> {
    await AgendaModel.update(AgendaMapper.toPersistence(agenda), { where: { id } });
    const updated = await AgendaModel.findByPk(id);
    return AgendaMapper.toDomain(updated!);
  }

  async delete(id: number): Promise<void> {
    await AgendaModel.destroy({ where: { id } });
  }
}
