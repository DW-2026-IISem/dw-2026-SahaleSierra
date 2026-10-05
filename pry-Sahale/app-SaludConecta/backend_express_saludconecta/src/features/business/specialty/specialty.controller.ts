import { Request, Response } from "express";
import { BaseController } from "../../../shared/http/base-controller";
import { CreateSpecialtyDto, PatchSpecialtyDto, UpdateSpecialtyDto } from "./dto";
import { SpecialtyService } from "./specialty.service";

/**
 * Capa Controller del feature Specialty.
 * Solo HTTP: lee `req`, llama al service y arma la respuesta.
 * El manejo de errores se delega en `run()` (ver `BaseController`).
 */
export class SpecialtyController extends BaseController {
  public constructor(
    private readonly service: SpecialtyService = new SpecialtyService()
  ) {
    super();
  }

  // ================== READ ==================
  public async getAll(_req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const specialties = await this.service.getAll();
      res.status(200).json({ specialties });
    });
  }

  public async getOne(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const specialty = await this.service.getOne(this.paramId(req));
      res.status(200).json({ specialty });
    });
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const specialty = await this.service.create(req.body as CreateSpecialtyDto);
      res.status(201).json({ specialty });
    });
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const specialty = await this.service.updatePut(
        this.paramId(req),
        req.body as UpdateSpecialtyDto
      );
      res.status(200).json({ specialty });
    });
  }

  public async updatePatch(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const specialty = await this.service.updatePatch(
        this.paramId(req),
        req.body as PatchSpecialtyDto
      );
      res.status(200).json({ specialty });
    });
  }

  // ================== DELETE ==================
  /** Eliminación física */
  public async deletePhysical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const id = this.paramId(req);
      await this.service.deletePhysical(id);
      res.status(200).json({ message: "Specialty permanently deleted", id });
    });
  }

  /** Eliminación lógica → status = inactive */
  public async deleteLogical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const specialty = await this.service.deleteLogical(this.paramId(req));
      res.status(200).json({
        message: "Specialty deactivated (logical delete)",
        specialty,
      });
    });
  }
}
