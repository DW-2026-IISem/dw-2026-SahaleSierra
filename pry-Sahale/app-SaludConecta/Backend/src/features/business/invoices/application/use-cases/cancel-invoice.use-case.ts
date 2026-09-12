import { Inject, Injectable } from '@nestjs/common';
import { Invoice } from '../../domain/entities/invoice.entity.js';
import { InvoiceNotFoundException } from '../../domain/exceptions/invoice-not-found.exception.js';
import { INVOICE_REPOSITORY } from '../../domain/interfaces/invoice-repository.interface.js';
import type { InvoiceRepository } from '../../domain/interfaces/invoice-repository.interface.js';

@Injectable()
export class CancelInvoiceUseCase {
  constructor(@Inject(INVOICE_REPOSITORY) private readonly invoiceRepository: InvoiceRepository) {}

  async execute(id: number): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findById(id);
    if (!invoice) throw new InvoiceNotFoundException(id);
    invoice.cancel();
    return this.invoiceRepository.update(id, invoice);
  }
}
