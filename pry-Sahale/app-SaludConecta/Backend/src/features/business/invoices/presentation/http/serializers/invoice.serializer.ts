import { Invoice } from '../../../domain/entities/invoice.entity.js';
import { InvoiceMapper } from '../../../application/mappers/invoice.mapper.js';
import { InvoiceResponseDto } from '../../../application/dto/invoice-response.dto.js';

export class InvoiceSerializer {
  static one(entity: Invoice): InvoiceResponseDto {
    return InvoiceMapper.toResponse(entity);
  }

  static many(entities: Invoice[]): InvoiceResponseDto[] {
    return entities.map(InvoiceMapper.toResponse);
  }
}
