import { Request, Response } from "express";
import { BaseController } from "../../../shared/http/base-controller";
import { CreateServiceDto, PatchServiceDto, UpdateServiceDto } from "./dto";
import { ServiceService } from "./service.service";

/**
 * Capa Controller del feature Service.
 * Solo HTTP: lee `req`, llama al service y arma la respuesta.
 * El manejo de errores se delega en `run()` (ver `BaseController`).
 */
export class ServiceController extends BaseController {
  public constructor(
    private readonly service: ServiceService = new ServiceService()
  ) {
    super();
  }

  // ================== READ ==================
  public async getAll(_req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const services = await this.service.getAll();
      res.status(200).json({ services });
    });
  }

  public async getOne(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const service = await this.service.getOne(this.paramId(req));
      res.status(200).json({ service });
    });
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const service = await this.service.create(req.body as CreateServiceDto);
      res.status(201).json({ service });
    });
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const service = await this.service.updatePut(
        this.paramId(req),
        req.body as UpdateServiceDto
      );
      res.status(200).json({ service });
    });
  }

  public async updatePatch(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const service = await this.service.updatePatch(
        this.paramId(req),
        req.body as PatchServiceDto
      );
      res.status(200).json({ service });
    });
  }

  // ================== DELETE ==================
  /** Eliminación física */
  public async deletePhysical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const id = this.paramId(req);
      await this.service.deletePhysical(id);
      res.status(200).json({ message: "Service permanently deleted", id });
    });
  }

  /** Eliminación lógica → status = inactive */
  public async deleteLogical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const service = await this.service.deleteLogical(this.paramId(req));
      res.status(200).json({
        message: "Service deactivated (logical delete)",
        service,
      });
    });
  }
}
