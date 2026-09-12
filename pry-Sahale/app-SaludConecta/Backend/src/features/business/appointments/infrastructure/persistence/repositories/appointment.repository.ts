import { Injectable } from '@nestjs/common';
import { Appointment } from '../../../domain/entities/appointment.entity.js';
import type {
  AppointmentFilter,
  AppointmentRepository as IAppointmentRepository,
} from '../../../domain/interfaces/appointment-repository.interface.js';
import type { PaginationParams } from '../../../../../../common/interfaces/pagination.interface.js';
import { AppointmentModel } from '../models/appointment.model.js';
import { AppointmentMapper } from '../../../application/mappers/appointment.mapper.js';

@Injectable()
export class SequelizeAppointmentRepository implements IAppointmentRepository {
  async create(appointment: Appointment): Promise<Appointment> {
    const created = await AppointmentModel.create(AppointmentMapper.toPersistence(appointment));
    return AppointmentMapper.toDomain(created);
  }

  async findById(id: number): Promise<Appointment | null> {
    const found = await AppointmentModel.findByPk(id);
    return found ? AppointmentMapper.toDomain(found) : null;
  }

  async findAll(filter: AppointmentFilter, pagination: PaginationParams) {
    const where: Record<string, unknown> = {};
    if (filter.patientId) where.patientId = filter.patientId;
    if (filter.agendaId) where.agendaId = filter.agendaId;
    if (filter.status) where.status = filter.status;

    const { rows, count } = await AppointmentModel.findAndCountAll({
      where,
      limit: pagination.limit,
      offset: (pagination.page - 1) * pagination.limit,
      order: [['startDate', 'DESC']],
    });

    return { data: rows.map(AppointmentMapper.toDomain), total: count };
  }

  async update(id: number, appointment: Appointment): Promise<Appointment> {
    await AppointmentModel.update(AppointmentMapper.toPersistence(appointment), { where: { id } });
    const updated = await AppointmentModel.findByPk(id);
    return AppointmentMapper.toDomain(updated!);
  }

  async delete(id: number): Promise<void> {
    await AppointmentModel.destroy({ where: { id } });
  }
}
