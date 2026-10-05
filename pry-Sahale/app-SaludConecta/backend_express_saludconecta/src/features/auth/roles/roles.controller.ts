import { Request, Response } from "express";
import { BaseController } from "../../../shared/http/base-controller";
import { CreateRoleDto, PatchRoleDto, UpdateRoleDto } from "./dto";
import { RolesService } from "./roles.service";

/**
 * Capa Controller del feature Roles.
 * Solo HTTP: lee `req`, llama al service y arma la respuesta.
 */
export class RolesController extends BaseController {
  public constructor(private readonly service: RolesService = new RolesService()) {
    super();
  }

  // ================== READ ==================
  public async getAll(_req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const roles = await this.service.getAll();
      res.status(200).json({ roles });
    });
  }

  public async getOne(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const role = await this.service.getOne(this.paramId(req));
      res.status(200).json({ role });
    });
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const role = await this.service.create(req.body as CreateRoleDto);
      res.status(201).json({ role });
    });
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const role = await this.service.updatePut(this.paramId(req), req.body as UpdateRoleDto);
      res.status(200).json({ role });
    });
  }

  public async updatePatch(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const role = await this.service.updatePatch(this.paramId(req), req.body as PatchRoleDto);
      res.status(200).json({ role });
    });
  }

  // ================== DELETE ==================
  /** Eliminación física. */
  public async deletePhysical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const id = this.paramId(req);
      await this.service.deletePhysical(id);
      res.status(200).json({ message: "Role permanently deleted", id });
    });
  }

  /** Eliminación lógica -> `status = inactive`. */
  public async deleteLogical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const role = await this.service.deleteLogical(this.paramId(req));
      res.status(200).json({ message: "Role deactivated (logical delete)", role });
    });
  }
}
