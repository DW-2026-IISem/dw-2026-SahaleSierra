import { Inject, Injectable } from '@nestjs/common';
import { InvoiceNotFoundException } from '../../domain/exceptions/invoice-not-found.exception.js';
import { INVOICE_REPOSITORY } from '../../domain/interfaces/invoice-repository.interface.js';
import type { InvoiceRepository } from '../../domain/interfaces/invoice-repository.interface.js';

@Injectable()
export class DeleteInvoiceUseCase {
  constructor(@Inject(INVOICE_REPOSITORY) private readonly invoiceRepository: InvoiceRepository) {}

  async execute(id: number): Promise<void> {
    const invoice = await this.invoiceRepository.findById(id);
    if (!invoice) throw new InvoiceNotFoundException(id);
    await this.invoiceRepository.delete(id);
  }
}
