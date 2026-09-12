import { Injectable } from '@nestjs/common';
import { DoctorSpecialty } from '../../../domain/entities/doctor-specialty.entity.js';
import type {
  DoctorSpecialtyFilter,
  DoctorSpecialtyRepository as IDoctorSpecialtyRepository,
} from '../../../domain/interfaces/doctor-specialty-repository.interface.js';
import type { PaginationParams } from '../../../../../../common/interfaces/pagination.interface.js';
import { DoctorSpecialtyModel } from '../models/doctor-specialty.model.js';
import { DoctorSpecialtyMapper } from '../../../application/mappers/doctor-specialty.mapper.js';

@Injectable()
export class SequelizeDoctorSpecialtyRepository implements IDoctorSpecialtyRepository {
  async create(relation: DoctorSpecialty): Promise<DoctorSpecialty> {
    const created = await DoctorSpecialtyModel.create(DoctorSpecialtyMapper.toPersistence(relation));
    return DoctorSpecialtyMapper.toDomain(created);
  }

  async findById(id: number): Promise<DoctorSpecialty | null> {
    const found = await DoctorSpecialtyModel.findByPk(id);
    return found ? DoctorSpecialtyMapper.toDomain(found) : null;
  }

  async findByPair(doctorId: number, specialtyId: number): Promise<DoctorSpecialty | null> {
    const found = await DoctorSpecialtyModel.findOne({ where: { doctorId, specialtyId } });
    return found ? DoctorSpecialtyMapper.toDomain(found) : null;
  }

  async findAll(filter: DoctorSpecialtyFilter, pagination: PaginationParams) {
    const where: Record<string, unknown> = {};
    if (filter.doctorId) where.doctorId = filter.doctorId;
    if (filter.specialtyId) where.specialtyId = filter.specialtyId;
    if (filter.status) where.status = filter.status;

    const { rows, count } = await DoctorSpecialtyModel.findAndCountAll({
      where,
      limit: pagination.limit,
      offset: (pagination.page - 1) * pagination.limit,
      order: [['id', 'DESC']],
    });

    return { data: rows.map(DoctorSpecialtyMapper.toDomain), total: count };
  }

  async delete(id: number): Promise<void> {
    await DoctorSpecialtyModel.destroy({ where: { id } });
  }
}
