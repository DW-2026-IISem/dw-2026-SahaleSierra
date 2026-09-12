import { Module } from '@nestjs/common';
import { InvoicesController } from './presentation/http/controllers/invoices.controller.js';
import { CreateInvoiceUseCase } from './application/use-cases/create-invoice.use-case.js';
import { PayInvoiceUseCase } from './application/use-cases/pay-invoice.use-case.js';
import { CancelInvoiceUseCase } from './application/use-cases/cancel-invoice.use-case.js';
import { GetInvoiceUseCase } from './application/use-cases/get-invoice.use-case.js';
import { ListInvoicesUseCase } from './application/use-cases/list-invoices.use-case.js';
import { DeleteInvoiceUseCase } from './application/use-cases/delete-invoice.use-case.js';
import { SequelizeInvoiceRepository } from './infrastructure/persistence/repositories/invoice.repository.js';
import { INVOICE_REPOSITORY } from './domain/interfaces/invoice-repository.interface.js';
import { EncountersModule } from '../encounters/encounters.module.js';

@Module({
  imports: [EncountersModule],
  controllers: [InvoicesController],
  providers: [
    CreateInvoiceUseCase,
    PayInvoiceUseCase,
    CancelInvoiceUseCase,
    GetInvoiceUseCase,
    ListInvoicesUseCase,
    DeleteInvoiceUseCase,
    { provide: INVOICE_REPOSITORY, useClass: SequelizeInvoiceRepository },
  ],
  exports: [INVOICE_REPOSITORY],
})
export class InvoicesModule {}
