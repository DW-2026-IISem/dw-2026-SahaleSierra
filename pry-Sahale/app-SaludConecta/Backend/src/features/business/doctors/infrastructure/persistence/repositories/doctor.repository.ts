import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { Doctor } from '../../../domain/entities/doctor.entity.js';
import {
  DoctorFilter,
  DoctorRepository as IDoctorRepository,
} from '../../../domain/interfaces/doctor-repository.interface.js';
import { PaginationParams } from '../../../../../../common/interfaces/pagination.interface.js';
import { DoctorModel } from '../models/doctor.model.js';
import { DoctorMapper } from '../../../application/mappers/doctor.mapper.js';

@Injectable()
export class SequelizeDoctorRepository implements IDoctorRepository {
  async create(doctor: Doctor): Promise<Doctor> {
    const created = await DoctorModel.create(DoctorMapper.toPersistence(doctor));
    return DoctorMapper.toDomain(created);
  }

  async findById(id: number): Promise<Doctor | null> {
    const found = await DoctorModel.findByPk(id);
    return found ? DoctorMapper.toDomain(found) : null;
  }

  async findAll(filter: DoctorFilter, pagination: PaginationParams) {
    const where: Record<string, unknown> = {};
    if (filter.name) where.name = { [Op.like]: `%${filter.name}%` };
    if (filter.status) where.status = filter.status;

    const { rows, count } = await DoctorModel.findAndCountAll({
      where,
      limit: pagination.limit,
      offset: (pagination.page - 1) * pagination.limit,
      order: [['id', 'DESC']],
    });

    return { data: rows.map(DoctorMapper.toDomain), total: count };
  }

  async update(id: number, doctor: Doctor): Promise<Doctor> {
    await DoctorModel.update(DoctorMapper.toPersistence(doctor), { where: { id } });
    const updated = await DoctorModel.findByPk(id);
    return DoctorMapper.toDomain(updated!);
  }

  async delete(id: number): Promise<void> {
    await DoctorModel.destroy({ where: { id } });
  }
}
