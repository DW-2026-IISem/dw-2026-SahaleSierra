import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { Specialty } from '../../../domain/entities/specialty.entity.js';
import {
  SpecialtyFilter,
  SpecialtyRepository as ISpecialtyRepository,
} from '../../../domain/interfaces/specialty-repository.interface.js';
import { PaginationParams } from '../../../../../../common/interfaces/pagination.interface.js';
import { SpecialtyModel } from '../models/specialty.model.js';
import { SpecialtyMapper } from '../../../application/mappers/specialty.mapper.js';

@Injectable()
export class SequelizeSpecialtyRepository implements ISpecialtyRepository {
  async create(specialty: Specialty): Promise<Specialty> {
    const created = await SpecialtyModel.create(SpecialtyMapper.toPersistence(specialty));
    return SpecialtyMapper.toDomain(created);
  }

  async findById(id: number): Promise<Specialty | null> {
    const found = await SpecialtyModel.findByPk(id);
    return found ? SpecialtyMapper.toDomain(found) : null;
  }

  async findByName(name: string): Promise<Specialty | null> {
    const found = await SpecialtyModel.findOne({ where: { name } });
    return found ? SpecialtyMapper.toDomain(found) : null;
  }

  async findAll(filter: SpecialtyFilter, pagination: PaginationParams) {
    const where: Record<string, unknown> = {};
    if (filter.name) where.name = { [Op.like]: `%${filter.name}%` };
    if (filter.status) where.status = filter.status;

    const { rows, count } = await SpecialtyModel.findAndCountAll({
      where,
      limit: pagination.limit,
      offset: (pagination.page - 1) * pagination.limit,
      order: [['id', 'DESC']],
    });

    return { data: rows.map(SpecialtyMapper.toDomain), total: count };
  }

  async update(id: number, specialty: Specialty): Promise<Specialty> {
    await SpecialtyModel.update(SpecialtyMapper.toPersistence(specialty), { where: { id } });
    const updated = await SpecialtyModel.findByPk(id);
    return SpecialtyMapper.toDomain(updated!);
  }

  async delete(id: number): Promise<void> {
    await SpecialtyModel.destroy({ where: { id } });
  }
}
