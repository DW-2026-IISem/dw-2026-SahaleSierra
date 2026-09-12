import { Injectable } from '@nestjs/common';
import { Authorization } from '../../../domain/entities/authorization.entity.js';
import type {
  AuthorizationFilter,
  AuthorizationRepository as IAuthorizationRepository,
} from '../../../domain/interfaces/authorization-repository.interface.js';
import type { PaginationParams } from '../../../../../../common/interfaces/pagination.interface.js';
import { AuthorizationModel } from '../models/authorization.model.js';
import { AuthorizationMapper } from '../../../application/mappers/authorization.mapper.js';

@Injectable()
export class SequelizeAuthorizationRepository implements IAuthorizationRepository {
  async create(authorization: Authorization): Promise<Authorization> {
    const created = await AuthorizationModel.create(AuthorizationMapper.toPersistence(authorization));
    return AuthorizationMapper.toDomain(created);
  }

  async findById(id: number): Promise<Authorization | null> {
    const found = await AuthorizationModel.findByPk(id);
    return found ? AuthorizationMapper.toDomain(found) : null;
  }

  async findByAppointmentId(appointmentId: number): Promise<Authorization | null> {
    const found = await AuthorizationModel.findOne({ where: { appointmentId } });
    return found ? AuthorizationMapper.toDomain(found) : null;
  }

  async findAll(filter: AuthorizationFilter, pagination: PaginationParams) {
    const where: Record<string, unknown> = {};
    if (filter.appointmentId) where.appointmentId = filter.appointmentId;
    if (filter.status) where.status = filter.status;

    const { rows, count } = await AuthorizationModel.findAndCountAll({
      where,
      limit: pagination.limit,
      offset: (pagination.page - 1) * pagination.limit,
      order: [['id', 'DESC']],
    });

    return { data: rows.map(AuthorizationMapper.toDomain), total: count };
  }

  async update(id: number, authorization: Authorization): Promise<Authorization> {
    await AuthorizationModel.update(AuthorizationMapper.toPersistence(authorization), { where: { id } });
    const updated = await AuthorizationModel.findByPk(id);
    return AuthorizationMapper.toDomain(updated!);
  }

  async delete(id: number): Promise<void> {
    await AuthorizationModel.destroy({ where: { id } });
  }
}
