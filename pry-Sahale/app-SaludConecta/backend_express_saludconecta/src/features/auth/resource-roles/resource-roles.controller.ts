import { Request, Response } from "express";
import { BaseController } from "../../../shared/http/base-controller";
import { CreateResourceRoleDto } from "./dto";
import { ResourceRolesService } from "./resource-roles.service";

/**
 * Capa Controller del feature ResourceRoles.
 *
 * Orden de operaciones: getAll → getOne → grant (create) → deactivate → reactivate.
 * `GET /api/resource-roles` acepta filtros `?role_id=` y `?resource_id=`.
 */
export class ResourceRolesController extends BaseController {
  public constructor(private readonly service: ResourceRolesService = new ResourceRolesService()) {
    super();
  }

  // ================== READ ==================
  public async getAll(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const grants = await this.service.getAll({
        role_id: toOptionalNumber(req.query.role_id),
        resource_id: toOptionalNumber(req.query.resource_id),
      });
      res.status(200).json({ grants });
    });
  }

  public async getOne(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const grant = await this.service.getOne(this.paramId(req));
      res.status(200).json({ grant });
    });
  }

  // ================== CREATE (conceder permiso) ==================
  public async grant(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const grant = await this.service.grant(req.body as CreateResourceRoleDto);
      res.status(201).json({ message: "Resource granted to role", grant });
    });
  }

  // ================== STATE ==================
  /** Retirar el permiso (borrado lógico). */
  public async deactivate(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const grant = await this.service.deactivate(this.paramId(req));
      res.status(200).json({ message: "Grant deactivated (permission revoked)", grant });
    });
  }

  /** Reactivar la concesión. */
  public async reactivate(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const grant = await this.service.reactivate(this.paramId(req));
      res.status(200).json({ message: "Grant reactivated", grant });
    });
  }
}

/** Convierte un `query param` en número o `undefined` (sin lanzar por basura). */
function toOptionalNumber(value: unknown): number | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  if (typeof raw !== "string" || !/^\d+$/.test(raw)) return undefined;
  return Number(raw);
}
