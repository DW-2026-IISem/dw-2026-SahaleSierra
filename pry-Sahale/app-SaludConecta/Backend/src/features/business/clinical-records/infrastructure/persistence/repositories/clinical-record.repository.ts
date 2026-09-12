import { Injectable } from '@nestjs/common';
import { ClinicalRecord } from '../../../domain/entities/clinical-record.entity.js';
import type {
  ClinicalRecordFilter,
  ClinicalRecordRepository as IClinicalRecordRepository,
} from '../../../domain/interfaces/clinical-record-repository.interface.js';
import type { PaginationParams } from '../../../../../../common/interfaces/pagination.interface.js';
import { ClinicalRecordModel } from '../models/clinical-record.model.js';
import { ClinicalRecordMapper } from '../../../application/mappers/clinical-record.mapper.js';

@Injectable()
export class SequelizeClinicalRecordRepository implements IClinicalRecordRepository {
  async create(record: ClinicalRecord): Promise<ClinicalRecord> {
    const created = await ClinicalRecordModel.create(ClinicalRecordMapper.toPersistence(record));
    return ClinicalRecordMapper.toDomain(created);
  }

  async findById(id: number): Promise<ClinicalRecord | null> {
    const found = await ClinicalRecordModel.findByPk(id);
    return found ? ClinicalRecordMapper.toDomain(found) : null;
  }

  async findByPatientId(patientId: number): Promise<ClinicalRecord | null> {
    const found = await ClinicalRecordModel.findOne({ where: { patientId } });
    return found ? ClinicalRecordMapper.toDomain(found) : null;
  }

  async findAll(filter: ClinicalRecordFilter, pagination: PaginationParams) {
    const where: Record<string, unknown> = {};
    if (filter.patientId) where.patientId = filter.patientId;
    if (filter.status) where.status = filter.status;

    const { rows, count } = await ClinicalRecordModel.findAndCountAll({
      where,
      limit: pagination.limit,
      offset: (pagination.page - 1) * pagination.limit,
      order: [['id', 'DESC']],
    });

    return { data: rows.map(ClinicalRecordMapper.toDomain), total: count };
  }

  async update(id: number, record: ClinicalRecord): Promise<ClinicalRecord> {
    await ClinicalRecordModel.update(ClinicalRecordMapper.toPersistence(record), { where: { id } });
    const updated = await ClinicalRecordModel.findByPk(id);
    return ClinicalRecordMapper.toDomain(updated!);
  }

  async delete(id: number): Promise<void> {
    await ClinicalRecordModel.destroy({ where: { id } });
  }
}
