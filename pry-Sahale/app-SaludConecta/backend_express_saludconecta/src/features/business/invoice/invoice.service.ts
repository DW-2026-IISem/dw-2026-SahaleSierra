import {
  CreateInvoiceDto,
  InvoiceResponseDto,
  PatchInvoiceDto,
  UpdateInvoiceDto,
  toInvoiceResponse,
} from "./dto";
import { InvoiceRepository } from "./invoice.repository";
import { Invoice, InvoiceI } from "./invoice.model";
import { EncounterRepository } from "../encounter/encounter.repository";
import { AppError } from "../../../shared/errors/app-error";
import { withTransaction } from "../../../shared/database/with-transaction";

/**
 * Capa Service del feature Invoice — facturas.
 *
 * Reglas de negocio:
 *  - `number` es único.
 *  - Una factura agrupa atenciones **facturables**: activas, `completed`, sin
 *    factura y del mismo paciente (misma historia clínica).
 *  - `subtotal` = suma de los totales de las atenciones; `total` = subtotal + tax.
 *  - El borrado físico libera las atenciones (`invoice_id = null`).
 *
 * El alta y el borrado físico son transaccionales (`withTransaction`).
 */
export class InvoiceService {
  public constructor(
    private readonly repository: InvoiceRepository = new InvoiceRepository(),
    private readonly encounterRepository: EncounterRepository = new EncounterRepository()
  ) {}

  // ================== READ ==================
  public async getAll(): Promise<InvoiceResponseDto[]> {
    const invoices = await this.repository.findAllActive();
    return invoices.map((invoice) => toInvoiceResponse(invoice));
  }

  public async getOne(id: number): Promise<InvoiceResponseDto> {
    return this.getWithEncounters(id);
  }

  // ================== CREATE ==================
  /** Transaccional: valida las atenciones, calcula totales y las asocia a la factura. */
  public async create(body: CreateInvoiceDto): Promise<InvoiceResponseDto> {
    if (!body.number) {
      throw new AppError(400, "number is required");
    }

    if (
      !body.encounter_ids ||
      !Array.isArray(body.encounter_ids) ||
      body.encounter_ids.length === 0
    ) {
      throw new AppError(400, "Invoice requires at least one encounter (encounter_ids)");
    }

    const tax = this.parseTax(body.tax ?? 0);
    const ids = Array.from(new Set(body.encounter_ids.map((id) => Number(id))));

    const invoiceId = await withTransaction(async (t) => {
      const duplicated = await this.repository.findByNumber(body.number, t);
      if (duplicated) {
        throw new AppError(400, `Invoice number already exists (id ${duplicated.id})`);
      }

      let subtotal = 0;
      let clinicalRecordId: number | null = null;

      for (const encounterId of ids) {
        const encounter = await this.encounterRepository.findById(encounterId, t, true);
        if (!encounter) {
          throw new AppError(404, `Encounter not found: ${encounterId}`);
        }
        if (encounter.status !== "active") {
          throw new AppError(400, `Encounter must be active: ${encounterId}`);
        }
        if (encounter.state !== "completed") {
          throw new AppError(400, `Encounter must be 'completed': ${encounterId}`);
        }
        if (encounter.invoice_id !== null) {
          throw new AppError(
            400,
            `Encounter already billed: ${encounterId} (invoice_id ${encounter.invoice_id})`
          );
        }
        if (clinicalRecordId === null) {
          clinicalRecordId = encounter.clinical_record_id;
        } else if (encounter.clinical_record_id !== clinicalRecordId) {
          throw new AppError(400, "All encounters must belong to the same patient");
        }
        subtotal += Number(encounter.total);
      }

      const invoice = await this.repository.create(
        {
          number: body.number,
          invoice_date: body.invoice_date ?? new Date(),
          subtotal,
          tax,
          total: subtotal + tax,
          state: body.state ?? "issued",
          status: body.status ?? "active",
        },
        t
      );

      await this.encounterRepository.assignInvoice(ids, invoice.id, t);
      return invoice.id;
    });

    return this.getWithEncounters(invoiceId);
  }

  // ================== UPDATE ==================
  /** PUT: cabecera (subtotal viene de las atenciones; total = subtotal + tax). */
  public async updatePut(id: number, body: UpdateInvoiceDto): Promise<InvoiceResponseDto> {
    const invoice = await this.findOrFail(id);

    const tax = this.parseTax(body.tax ?? 0);
    const total = Number(invoice.subtotal) + tax;

    await this.repository.update(invoice, {
      number: body.number ?? invoice.number,
      invoice_date: body.invoice_date ?? invoice.invoice_date,
      tax,
      total,
      state: body.state ?? invoice.state,
      status: body.status ?? invoice.status,
    });

    return this.getWithEncounters(invoice.id);
  }

  /** PATCH: cabecera parcial; si cambia tax se recalcula total. */
  public async updatePatch(id: number, body: PatchInvoiceDto): Promise<InvoiceResponseDto> {
    const invoice = await this.findOrFail(id);

    const changes: Partial<InvoiceI> = {};
    if (body.number !== undefined) changes.number = body.number;
    if (body.invoice_date !== undefined) changes.invoice_date = body.invoice_date;
    if (body.state !== undefined) changes.state = body.state;
    if (body.status !== undefined) changes.status = body.status;
    if (body.tax !== undefined) {
      const tax = this.parseTax(body.tax);
      changes.tax = tax;
      changes.total = Number(invoice.subtotal) + tax;
    }

    await this.repository.update(invoice, changes);
    return this.getWithEncounters(invoice.id);
  }

  // ================== DELETE ==================
  /** Eliminación física: libera las atenciones y borra la factura (transacción). */
  public async deletePhysical(id: number): Promise<void> {
    await withTransaction(async (t) => {
      const invoice = await this.repository.findById(id, t);
      if (!invoice) {
        throw new AppError(404, "Invoice not found");
      }
      await this.encounterRepository.releaseInvoice(id, t);
      await this.repository.delete(invoice, t);
    });
  }

  /** Eliminación lógica → status = inactive (las atenciones siguen asociadas) */
  public async deleteLogical(id: number): Promise<InvoiceResponseDto> {
    const invoice = await this.findOrFail(id);
    await this.repository.update(invoice, { status: "inactive" });
    return toInvoiceResponse(invoice);
  }

  // ================== HELPERS ==================
  private async findOrFail(id: number): Promise<Invoice> {
    const invoice = await this.repository.findById(id);
    if (!invoice) {
      throw new AppError(404, "Invoice not found");
    }
    return invoice;
  }

  private async getWithEncounters(id: number): Promise<InvoiceResponseDto> {
    const invoice = await this.repository.findByIdWithEncounters(id);
    if (!invoice) {
      throw new AppError(404, "Invoice not found");
    }
    return toInvoiceResponse(invoice);
  }

  private parseTax(value: unknown): number {
    const tax = Number(value);
    if (isNaN(tax) || tax < 0) {
      throw new AppError(400, "tax must be a number >= 0");
    }
    return tax;
  }
}
