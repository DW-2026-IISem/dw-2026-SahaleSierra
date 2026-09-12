import { Inject, Injectable } from '@nestjs/common';
import { Invoice } from '../../domain/entities/invoice.entity.js';
import { INVOICE_REPOSITORY } from '../../domain/interfaces/invoice-repository.interface.js';
import type { InvoiceFilter, InvoiceRepository } from '../../domain/interfaces/invoice-repository.interface.js';
import type { PaginationParams } from '../../../../../common/interfaces/pagination.interface.js';

@Injectable()
export class ListInvoicesUseCase {
  constructor(@Inject(INVOICE_REPOSITORY) private readonly invoiceRepository: InvoiceRepository) {}

  async execute(filter: InvoiceFilter, pagination: PaginationParams): Promise<{ data: Invoice[]; total: number }> {
    return this.invoiceRepository.findAll(filter, pagination);
  }
}
