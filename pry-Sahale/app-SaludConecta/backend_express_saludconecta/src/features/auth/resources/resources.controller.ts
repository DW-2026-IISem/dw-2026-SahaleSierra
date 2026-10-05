import { Request, Response } from "express";
import { BaseController } from "../../../shared/http/base-controller";
import { CreateResourceDto, PatchResourceDto, UpdateResourceDto } from "./dto";
import { ResourcesService } from "./resources.service";

/**
 * Capa Controller del feature Resources.
 * Solo HTTP: lee `req`, llama al service y arma la respuesta.
 */
export class ResourcesController extends BaseController {
  public constructor(private readonly service: ResourcesService = new ResourcesService()) {
    super();
  }

  // ================== READ ==================
  public async getAll(_req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const resources = await this.service.getAll();
      res.status(200).json({ resources });
    });
  }

  public async getOne(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const resource = await this.service.getOne(this.paramId(req));
      res.status(200).json({ resource });
    });
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const resource = await this.service.create(req.body as CreateResourceDto);
      res.status(201).json({ resource });
    });
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const resource = await this.service.updatePut(
        this.paramId(req),
        req.body as UpdateResourceDto,
      );
      res.status(200).json({ resource });
    });
  }

  public async updatePatch(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const resource = await this.service.updatePatch(
        this.paramId(req),
        req.body as PatchResourceDto,
      );
      res.status(200).json({ resource });
    });
  }

  // ================== DELETE ==================
  /** Eliminación física. */
  public async deletePhysical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const id = this.paramId(req);
      await this.service.deletePhysical(id);
      res.status(200).json({ message: "Resource permanently deleted", id });
    });
  }

  /** Eliminación lógica -> `status = inactive`. */
  public async deleteLogical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const resource = await this.service.deleteLogical(this.paramId(req));
      res.status(200).json({ message: "Resource deactivated (logical delete)", resource });
    });
  }
}
