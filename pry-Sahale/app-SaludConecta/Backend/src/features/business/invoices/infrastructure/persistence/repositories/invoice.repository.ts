import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { Invoice } from '../../../domain/entities/invoice.entity.js';
import type {
  InvoiceFilter,
  InvoiceRepository as IInvoiceRepository,
} from '../../../domain/interfaces/invoice-repository.interface.js';
import type { PaginationParams } from '../../../../../../common/interfaces/pagination.interface.js';
import { InvoiceModel } from '../models/invoice.model.js';
import { InvoiceMapper } from '../../../application/mappers/invoice.mapper.js';

@Injectable()
export class SequelizeInvoiceRepository implements IInvoiceRepository {
  async create(invoice: Invoice): Promise<Invoice> {
    const created = await InvoiceModel.create(InvoiceMapper.toPersistence(invoice));
    return InvoiceMapper.toDomain(created);
  }

  async findById(id: number): Promise<Invoice | null> {
    const found = await InvoiceModel.findByPk(id);
    return found ? InvoiceMapper.toDomain(found) : null;
  }

  async findByNumber(number: string): Promise<Invoice | null> {
    const found = await InvoiceModel.findOne({ where: { number } });
    return found ? InvoiceMapper.toDomain(found) : null;
  }

  async findAll(filter: InvoiceFilter, pagination: PaginationParams) {
    const where: Record<string, unknown> = {};
    if (filter.number) where.number = { [Op.like]: `%${filter.number}%` };
    if (filter.status) where.status = filter.status;

    const { rows, count } = await InvoiceModel.findAndCountAll({
      where,
      limit: pagination.limit,
      offset: (pagination.page - 1) * pagination.limit,
      order: [['id', 'DESC']],
    });

    return { data: rows.map(InvoiceMapper.toDomain), total: count };
  }

  async update(id: number, invoice: Invoice): Promise<Invoice> {
    await InvoiceModel.update(InvoiceMapper.toPersistence(invoice), { where: { id } });
    const updated = await InvoiceModel.findByPk(id);
    return InvoiceMapper.toDomain(updated!);
  }

  async delete(id: number): Promise<void> {
    await InvoiceModel.destroy({ where: { id } });
  }
}
