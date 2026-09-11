import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { Patient } from '../../../domain/entities/patient.entity.js';
import {
  PatientFilter,
  PatientRepository as IPatientRepository,
} from '../../../domain/interfaces/patient-repository.interface.js';
import { PaginationParams } from '../../../../../../common/interfaces/pagination.interface.js';
import { PatientModel } from '../models/patient.model.js';
import { PatientMapper } from '../../../application/mappers/patient.mapper.js';

@Injectable()
export class SequelizePatientRepository implements IPatientRepository {
  async create(patient: Patient): Promise<Patient> {
    const created = await PatientModel.create(PatientMapper.toPersistence(patient));
    return PatientMapper.toDomain(created);
  }

  async findById(id: number): Promise<Patient | null> {
    const found = await PatientModel.findByPk(id);
    return found ? PatientMapper.toDomain(found) : null;
  }

  async findByDocumentNumber(documentNumber: string): Promise<Patient | null> {
    const found = await PatientModel.findOne({ where: { documentNumber } });
    return found ? PatientMapper.toDomain(found) : null;
  }

  async findAll(
    filter: PatientFilter,
    pagination: PaginationParams,
  ): Promise<{ data: Patient[]; total: number }> {
    const where: Record<string, unknown> = {};
    if (filter.name) where.name = { [Op.like]: `%${filter.name}%` };
    if (filter.documentNumber) where.documentNumber = filter.documentNumber;
    if (filter.status) where.status = filter.status;

    const { rows, count } = await PatientModel.findAndCountAll({
      where,
      limit: pagination.limit,
      offset: (pagination.page - 1) * pagination.limit,
      order: [['id', 'DESC']],
    });

    return { data: rows.map(PatientMapper.toDomain), total: count };
  }

  async update(id: number, patient: Patient): Promise<Patient> {
    await PatientModel.update(PatientMapper.toPersistence(patient), { where: { id } });
    const updated = await PatientModel.findByPk(id);
    return PatientMapper.toDomain(updated!);
  }

  async delete(id: number): Promise<void> {
    await PatientModel.destroy({ where: { id } });
  }
}
