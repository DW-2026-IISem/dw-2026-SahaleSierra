import { CreationAttributes, Transaction } from "sequelize";
import { Invoice, InvoiceI } from "./invoice.model";
import { Encounter } from "../encounter/encounter.model";

/** `include` reutilizable: atenciones agrupadas por la factura. */
const ENCOUNTERS = [{ model: Encounter, as: "encounters" }];

/**
 * Capa Repository del feature Invoice (tabla `invoices`).
 *
 * Única que habla con Sequelize. No contiene reglas de negocio.
 */
export class InvoiceRepository {
  /** Facturas activas (con sus atenciones). */
  public async findAllActive(): Promise<Invoice[]> {
    return Invoice.findAll({ where: { status: "active" }, include: ENCOUNTERS });
  }

  /** Una factura por PK (o `null`), sin atenciones y sin filtrar por estado. */
  public async findById(id: number, transaction?: Transaction): Promise<Invoice | null> {
    return Invoice.findByPk(id, { transaction });
  }

  /** Una factura por PK con sus atenciones (o `null`). */
  public async findByIdWithEncounters(id: number): Promise<Invoice | null> {
    return Invoice.findByPk(id, { include: ENCOUNTERS });
  }

  /** La factura con ese número (único), o `null`. */
  public async findByNumber(number: string, transaction?: Transaction): Promise<Invoice | null> {
    return Invoice.findOne({ where: { number }, transaction });
  }

  public async create(
    data: CreationAttributes<Invoice>,
    transaction?: Transaction
  ): Promise<Invoice> {
    return Invoice.create(data, { transaction });
  }

  public async update(
    invoice: Invoice,
    data: Partial<InvoiceI>,
    transaction?: Transaction
  ): Promise<Invoice> {
    return invoice.update(data, { transaction });
  }

  public async delete(invoice: Invoice, transaction?: Transaction): Promise<void> {
    await invoice.destroy({ transaction });
  }
}
