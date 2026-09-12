import { Inject, Injectable } from '@nestjs/common';
import { Invoice } from '../../domain/entities/invoice.entity.js';
import { InvoiceNumberAlreadyExistsException } from '../../domain/exceptions/invoice-number-already-exists.exception.js';
import { EncounterAlreadyInvoicedException } from '../../domain/exceptions/encounter-already-invoiced.exception.js';
import { INVOICE_REPOSITORY } from '../../domain/interfaces/invoice-repository.interface.js';
import type { InvoiceRepository } from '../../domain/interfaces/invoice-repository.interface.js';
import { ENCOUNTER_REPOSITORY } from '../../../encounters/domain/interfaces/encounter-repository.interface.js';
import type { EncounterRepository } from '../../../encounters/domain/interfaces/encounter-repository.interface.js';
import { EncounterNotFoundException } from '../../../encounters/domain/exceptions/encounter-not-found.exception.js';
import { CreateInvoiceDto } from '../dto/create-invoice.dto.js';

const TAX_RATE = 0.19;

@Injectable()
export class CreateInvoiceUseCase {
  constructor(
    @Inject(INVOICE_REPOSITORY) private readonly invoiceRepository: InvoiceRepository,
    @Inject(ENCOUNTER_REPOSITORY) private readonly encounterRepository: EncounterRepository,
  ) {}

  async execute(dto: CreateInvoiceDto): Promise<Invoice> {
    const existingNumber = await this.invoiceRepository.findByNumber(dto.number);
    if (existingNumber) throw new InvoiceNumberAlreadyExistsException(dto.number);

    const encounters = [];
    for (const encounterId of dto.encounterIds) {
      const encounter = await this.encounterRepository.findById(encounterId);
      if (!encounter) throw new EncounterNotFoundException(encounterId);
      if (encounter.invoiceId) throw new EncounterAlreadyInvoicedException(encounterId);
      encounters.push(encounter);
    }

    const subtotal = encounters.reduce((sum, e) => sum + e.total, 0);
    const tax = Number((subtotal * TAX_RATE).toFixed(2));
    const total = Number((subtotal + tax).toFixed(2));

    const invoice = Invoice.create({
      number: dto.number,
      date: new Date(),
      subtotal,
      tax,
      total,
    });

    const created = await this.invoiceRepository.create(invoice);

    for (const encounter of encounters) {
      encounter.assignInvoice(created.id!);
      await this.encounterRepository.update(encounter.id!, encounter);
    }

    return created;
  }
}
