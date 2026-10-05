import { Request, Response } from "express";
import { BaseController } from "../../../shared/http/base-controller";
import { CreateRoleUserDto } from "./dto";
import { RoleUsersService } from "./role-users.service";

/**
 * Capa Controller del feature RoleUsers.
 *
 * Orden de operaciones (el mismo patrón del proyecto):
 * getAll → getOne → assign (create) → deactivate → reactivate.
 * No expone borrado físico: la revocación es lógica para preservar auditoría.
 */
export class RoleUsersController extends BaseController {
  public constructor(private readonly service: RoleUsersService = new RoleUsersService()) {
    super();
  }

  // ================== READ ==================
  public async getAll(_req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const assignments = await this.service.getAll();
      res.status(200).json({ assignments });
    });
  }

  public async getOne(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const assignment = await this.service.getOne(this.paramId(req));
      res.status(200).json({ assignment });
    });
  }

  // ================== CREATE (asignar) ==================
  public async assign(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const assignment = await this.service.assign(req.body as CreateRoleUserDto);
      res.status(201).json({ assignment });
    });
  }

  // ================== STATE ==================
  /** Retirar el rol (borrado lógico). */
  public async deactivate(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const assignment = await this.service.deactivate(this.paramId(req));
      res.status(200).json({ message: "Role assignment deactivated", assignment });
    });
  }

  /** Reactivar la asignación. */
  public async reactivate(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const assignment = await this.service.reactivate(this.paramId(req));
      res.status(200).json({ message: "Role assignment reactivated", assignment });
    });
  }
}
