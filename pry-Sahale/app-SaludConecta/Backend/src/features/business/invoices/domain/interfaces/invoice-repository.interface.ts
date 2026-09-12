import { Invoice } from '../entities/invoice.entity.js';
import type { PaginationParams } from '../../../../../common/interfaces/pagination.interface.js';

export interface InvoiceFilter {
  number?: string;
  status?: string;
}

export const INVOICE_REPOSITORY = 'INVOICE_REPOSITORY';

export interface InvoiceRepository {
  create(invoice: Invoice): Promise<Invoice>;
  findById(id: number): Promise<Invoice | null>;
  findByNumber(number: string): Promise<Invoice | null>;
  findAll(filter: InvoiceFilter, pagination: PaginationParams): Promise<{ data: Invoice[]; total: number }>;
  update(id: number, invoice: Invoice): Promise<Invoice>;
  delete(id: number): Promise<void>;
}
