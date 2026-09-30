import { Request, Response } from "express";
import { sequelize } from "../../../database/db";
import { Invoice, InvoiceI, InvoiceState } from "./invoice.model";
import { Encounter } from "../encounter/encounter.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

type InvoiceCreateBody = {
  number: string;
  invoice_date?: Date | string;
  tax?: number;
  state?: InvoiceState;
  status?: "active" | "inactive";
  encounter_ids: number[];
};

type InvoiceEditableBody = Partial<
  Pick<InvoiceI, "number" | "invoice_date" | "tax" | "state" | "status">
>;

export class InvoiceController {
  // ================== READ ==================
  public async getAll(req: Request, res: Response) {
    try {
      const invoices = await Invoice.findAll({
        where: { status: "active" },
        include: [{ model: Encounter, as: "encounters" }],
      });
      res.status(200).json({ invoices });
    } catch (error) {
      res.status(500).json({ error: "Error fetching invoices", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const invoice = await Invoice.findByPk(id, {
        include: [{ model: Encounter, as: "encounters" }],
      });
      if (!invoice) {
        res.status(404).json({ error: "Invoice not found" });
        return;
      }
      res.status(200).json({ invoice });
    } catch (error) {
      res.status(500).json({ error: "Error fetching invoice", detail: String(error) });
    }
  }

  // ================== CREATE ==================
  /**
   * Transaccional: agrupa atenciones facturables (activas, "completed", sin factura)
   * de un mismo paciente (misma historia clínica). subtotal = Σ total de atenciones;
   * total = subtotal + tax. Marca encounters.invoice_id.
   */
  public async create(req: Request, res: Response) {
    const t = await sequelize.transaction();
    try {
      const body = req.body as InvoiceCreateBody;

      if (!body.number) {
        await t.rollback();
        res.status(400).json({ error: "number is required" });
        return;
      }

      if (!body.encounter_ids || !Array.isArray(body.encounter_ids) || body.encounter_ids.length === 0) {
        await t.rollback();
        res.status(400).json({ error: "Invoice requires at least one encounter (encounter_ids)" });
        return;
      }

      const tax = Number(body.tax ?? 0);
      if (isNaN(tax) || tax < 0) {
        await t.rollback();
        res.status(400).json({ error: "tax must be a number >= 0" });
        return;
      }

      const duplicated = await Invoice.findOne({
        where: { number: body.number },
        transaction: t,
      });
      if (duplicated) {
        await t.rollback();
        res.status(400).json({ error: "Invoice number already exists", id: duplicated.id });
        return;
      }

      const ids = Array.from(new Set(body.encounter_ids.map((id) => Number(id))));
      let subtotal = 0;
      let clinicalRecordId: number | null = null;

      for (const encounterId of ids) {
        const encounter = await Encounter.findByPk(encounterId, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
        if (!encounter) {
          await t.rollback();
          res.status(404).json({ error: `Encounter not found: ${encounterId}` });
          return;
        }
        if (encounter.status !== "active") {
          await t.rollback();
          res.status(400).json({ error: `Encounter must be active: ${encounterId}` });
          return;
        }
        if (encounter.state !== "completed") {
          await t.rollback();
          res.status(400).json({ error: `Encounter must be 'completed': ${encounterId}` });
          return;
        }
        if (encounter.invoice_id !== null) {
          await t.rollback();
          res.status(400).json({
            error: `Encounter already billed: ${encounterId}`,
            invoice_id: encounter.invoice_id,
          });
          return;
        }
        if (clinicalRecordId === null) {
          clinicalRecordId = encounter.clinical_record_id;
        } else if (encounter.clinical_record_id !== clinicalRecordId) {
          await t.rollback();
          res.status(400).json({ error: "All encounters must belong to the same patient" });
          return;
        }
        subtotal += Number(encounter.total);
      }

      const invoice = await Invoice.create(
        {
          number: body.number,
          invoice_date: body.invoice_date ?? new Date(),
          subtotal,
          tax,
          total: subtotal + tax,
          state: body.state ?? "issued",
          status: body.status ?? "active",
        },
        { transaction: t }
      );

      await Encounter.update(
        { invoice_id: invoice.id },
        { where: { id: ids }, transaction: t }
      );

      await t.commit();

      const withEncounters = await Invoice.findByPk(invoice.id, {
        include: [{ model: Encounter, as: "encounters" }],
      });
      res.status(201).json({ invoice: withEncounters });
    } catch (error) {
      await t.rollback();
      res.status(500).json({ error: "Error creating invoice", detail: String(error) });
    }
  }

  // ================== UPDATE ==================
  /** PUT: cabecera (subtotal viene de las atenciones; total = subtotal + tax). */
  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as InvoiceEditableBody;
      const invoice = await Invoice.findByPk(id);
      if (!invoice) {
        res.status(404).json({ error: "Invoice not found" });
        return;
      }

      const tax = Number(body.tax ?? 0);
      if (isNaN(tax) || tax < 0) {
        res.status(400).json({ error: "tax must be a number >= 0" });
        return;
      }
      const total = Number(invoice.subtotal) + tax;

      await invoice.update({
        number: body.number ?? invoice.number,
        invoice_date: body.invoice_date ?? invoice.invoice_date,
        tax,
        total,
        state: body.state ?? invoice.state,
        status: body.status ?? invoice.status,
      });

      const withEncounters = await Invoice.findByPk(invoice.id, {
        include: [{ model: Encounter, as: "encounters" }],
      });
      res.status(200).json({ invoice: withEncounters });
    } catch (error) {
      res.status(500).json({ error: "Error updating invoice (PUT)", detail: String(error) });
    }
  }

  /** PATCH: cabecera parcial; si cambia tax se recalcula total. */
  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as InvoiceEditableBody;
      const invoice = await Invoice.findByPk(id);
      if (!invoice) {
        res.status(404).json({ error: "Invoice not found" });
        return;
      }

      const patch: InvoiceEditableBody & { total?: number } = {};
      if (body.number !== undefined) patch.number = body.number;
      if (body.invoice_date !== undefined) patch.invoice_date = body.invoice_date;
      if (body.state !== undefined) patch.state = body.state;
      if (body.status !== undefined) patch.status = body.status;
      if (body.tax !== undefined) {
        const tax = Number(body.tax);
        if (isNaN(tax) || tax < 0) {
          res.status(400).json({ error: "tax must be a number >= 0" });
          return;
        }
        patch.tax = tax;
        patch.total = Number(invoice.subtotal) + tax;
      }

      await invoice.update(patch);

      const withEncounters = await Invoice.findByPk(invoice.id, {
        include: [{ model: Encounter, as: "encounters" }],
      });
      res.status(200).json({ invoice: withEncounters });
    } catch (error) {
      res.status(500).json({ error: "Error updating invoice (PATCH)", detail: String(error) });
    }
  }

  // ================== DELETE ==================
  /** Eliminación física: libera las atenciones (invoice_id = null) y borra la factura (transacción). */
  public async deletePhysical(req: Request, res: Response) {
    const t = await sequelize.transaction();
    try {
      const id = paramId(req);
      const invoice = await Invoice.findByPk(id, { transaction: t });
      if (!invoice) {
        await t.rollback();
        res.status(404).json({ error: "Invoice not found" });
        return;
      }

      await Encounter.update(
        { invoice_id: null },
        { where: { invoice_id: id }, transaction: t }
      );
      await invoice.destroy({ transaction: t });
      await t.commit();
      res.status(200).json({ message: "Invoice permanently deleted", id });
    } catch (error) {
      await t.rollback();
      res.status(500).json({ error: "Error deleting invoice", detail: String(error) });
    }
  }

  /** Eliminación lógica → status = inactive (las atenciones siguen asociadas) */
  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const invoice = await Invoice.findByPk(id);
      if (!invoice) {
        res.status(404).json({ error: "Invoice not found" });
        return;
      }
      await invoice.update({ status: "inactive" });
      res.status(200).json({
        message: "Invoice deactivated (logical delete)",
        invoice,
      });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating invoice", detail: String(error) });
    }
  }
}
