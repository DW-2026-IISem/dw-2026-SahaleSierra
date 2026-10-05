import { Request, Response } from "express";
import { BaseController } from "../../../shared/http/base-controller";
import { CreateInvoiceDto, PatchInvoiceDto, UpdateInvoiceDto } from "./dto";
import { InvoiceService } from "./invoice.service";

/**
 * Capa Controller del feature Invoice.
 * Solo HTTP: lee `req`, llama al service y arma la respuesta.
 * El manejo de errores se delega en `run()` (ver `BaseController`).
 */
export class InvoiceController extends BaseController {
  public constructor(
    private readonly service: InvoiceService = new InvoiceService()
  ) {
    super();
  }

  // ================== READ ==================
  public async getAll(_req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const invoices = await this.service.getAll();
      res.status(200).json({ invoices });
    });
  }

  public async getOne(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const invoice = await this.service.getOne(this.paramId(req));
      res.status(200).json({ invoice });
    });
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const invoice = await this.service.create(req.body as CreateInvoiceDto);
      res.status(201).json({ invoice });
    });
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const invoice = await this.service.updatePut(
        this.paramId(req),
        req.body as UpdateInvoiceDto
      );
      res.status(200).json({ invoice });
    });
  }

  public async updatePatch(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const invoice = await this.service.updatePatch(
        this.paramId(req),
        req.body as PatchInvoiceDto
      );
      res.status(200).json({ invoice });
    });
  }

  // ================== DELETE ==================
  /** Eliminación física */
  public async deletePhysical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const id = this.paramId(req);
      await this.service.deletePhysical(id);
      res.status(200).json({ message: "Invoice permanently deleted", id });
    });
  }

  /** Eliminación lógica → status = inactive */
  public async deleteLogical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const invoice = await this.service.deleteLogical(this.paramId(req));
      res.status(200).json({
        message: "Invoice deactivated (logical delete)",
        invoice,
      });
    });
  }
}
