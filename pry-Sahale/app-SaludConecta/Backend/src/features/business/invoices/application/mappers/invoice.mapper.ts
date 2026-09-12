import { Invoice } from '../../domain/entities/invoice.entity.js';
import { InvoiceModel } from '../../infrastructure/persistence/models/invoice.model.js';
import { InvoiceResponseDto } from '../dto/invoice-response.dto.js';

export class InvoiceMapper {
  static toDomain(model: InvoiceModel): Invoice {
    return Invoice.reconstitute({
      id: model.id,
      number: model.number,
      date: model.date,
      subtotal: Number(model.subtotal),
      tax: Number(model.tax),
      total: Number(model.total),
      status: model.status as Invoice['status'],
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toPersistence(entity: Invoice): Partial<InvoiceModel> {
    return {
      number: entity.number,
      date: entity.date,
      subtotal: entity.subtotal,
      tax: entity.tax,
      total: entity.total,
      status: entity.status,
    } as Partial<InvoiceModel>;
  }

  static toResponse(entity: Invoice): InvoiceResponseDto {
    return {
      id: entity.id!,
      number: entity.number,
      date: entity.date,
      subtotal: entity.subtotal,
      tax: entity.tax,
      total: entity.total,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
