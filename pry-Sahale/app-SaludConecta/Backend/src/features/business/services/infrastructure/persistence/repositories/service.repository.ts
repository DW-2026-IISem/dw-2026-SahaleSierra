import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { Service } from '../../../domain/entities/service.entity.js';
import type {
  ServiceFilter,
  ServiceRepository as IServiceRepository,
} from '../../../domain/interfaces/service-repository.interface.js';
import type { PaginationParams } from '../../../../../../common/interfaces/pagination.interface.js';
import { ServiceModel } from '../models/service.model.js';
import { ServiceMapper } from '../../../application/mappers/service.mapper.js';

@Injectable()
export class SequelizeServiceRepository implements IServiceRepository {
  async create(service: Service): Promise<Service> {
    const created = await ServiceModel.create(ServiceMapper.toPersistence(service));
    return ServiceMapper.toDomain(created);
  }

  async findById(id: number): Promise<Service | null> {
    const found = await ServiceModel.findByPk(id);
    return found ? ServiceMapper.toDomain(found) : null;
  }

  async findByName(name: string): Promise<Service | null> {
    const found = await ServiceModel.findOne({ where: { name } });
    return found ? ServiceMapper.toDomain(found) : null;
  }

  async findAll(filter: ServiceFilter, pagination: PaginationParams) {
    const where: Record<string, unknown> = {};
    if (filter.name) where.name = { [Op.like]: `%${filter.name}%` };
    if (filter.status) where.status = filter.status;

    const { rows, count } = await ServiceModel.findAndCountAll({
      where,
      limit: pagination.limit,
      offset: (pagination.page - 1) * pagination.limit,
      order: [['id', 'DESC']],
    });

    return { data: rows.map(ServiceMapper.toDomain), total: count };
  }

  async update(id: number, service: Service): Promise<Service> {
    await ServiceModel.update(ServiceMapper.toPersistence(service), { where: { id } });
    const updated = await ServiceModel.findByPk(id);
    return ServiceMapper.toDomain(updated!);
  }

  async delete(id: number): Promise<void> {
    await ServiceModel.destroy({ where: { id } });
  }
}
