import { Request, Response } from "express";
import { BaseController } from "../../../shared/http/base-controller";
import { CreateEncounterDto, PatchEncounterDto, UpdateEncounterDto } from "./dto";
import { EncounterService } from "./encounter.service";

/**
 * Capa Controller del feature Encounter.
 * Solo HTTP: lee `req`, llama al service y arma la respuesta.
 * El manejo de errores se delega en `run()` (ver `BaseController`).
 */
export class EncounterController extends BaseController {
  public constructor(
    private readonly service: EncounterService = new EncounterService()
  ) {
    super();
  }

  // ================== READ ==================
  public async getAll(_req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const encounters = await this.service.getAll();
      res.status(200).json({ encounters });
    });
  }

  public async getOne(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const encounter = await this.service.getOne(this.paramId(req));
      res.status(200).json({ encounter });
    });
  }

  // ================== CREATE ==================
  /** Responde la atención creada y la cita, ya en `attended`. */
  public async create(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const { encounter, appointment } = await this.service.create(
        req.body as CreateEncounterDto
      );
      res.status(201).json({ encounter, appointment });
    });
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const encounter = await this.service.updatePut(
        this.paramId(req),
        req.body as UpdateEncounterDto
      );
      res.status(200).json({ encounter });
    });
  }

  public async updatePatch(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const encounter = await this.service.updatePatch(
        this.paramId(req),
        req.body as PatchEncounterDto
      );
      res.status(200).json({ encounter });
    });
  }

  // ================== DELETE ==================
  /** Eliminación física */
  public async deletePhysical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const id = this.paramId(req);
      await this.service.deletePhysical(id);
      res.status(200).json({ message: "Encounter permanently deleted", id });
    });
  }

  /** Eliminación lógica → status = inactive */
  public async deleteLogical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const encounter = await this.service.deleteLogical(this.paramId(req));
      res.status(200).json({
        message: "Encounter deactivated (logical delete)",
        encounter,
      });
    });
  }
}
