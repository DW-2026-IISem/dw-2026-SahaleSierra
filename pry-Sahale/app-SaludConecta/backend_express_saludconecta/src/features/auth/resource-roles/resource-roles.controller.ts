import { Request, Response } from "express";
import { BaseController } from "../../../shared/http/base-controller";
import { AppError } from "../../../shared/errors/app-error";
import { CreateResourceRoleDto, ReconcileResourceRolesDto } from "./dto";
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

  // ================== CREATE (conceder permiso / guardar matriz) ==================
  /**
   * Un mismo `POST /api/resource-roles` atiende dos formas de cuerpo:
   *  - `{ role_id, resource_id }`  -> concede un recurso (201, como antes).
   *  - `{ role_id, resource_ids }` -> guarda la matriz completa del rol (200).
   * Así el panel no necesita un recurso RBAC nuevo en el catálogo.
   */
  public async grant(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      if (isRecord(req.body) && req.body.resource_ids !== undefined) {
        const matrix = validateReconcileBody(req.body);
        const result = await this.service.saveRoleMatrix(matrix);
        res.status(200).json({ message: "Role permissions updated", result });
        return;
      }
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

/** `true` si el valor es un objeto JSON (no `null` ni arreglo). */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Entero positivo de verdad: rechaza `"3"`, `3.5`, `0` y negativos. */
function isPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

/**
 * Valida la **forma HTTP** del guardado de matriz. Las reglas de negocio (rol
 * activo, recursos activos, ADMIN protegido) viven en el service.
 */
function validateReconcileBody(body: Record<string, unknown>): ReconcileResourceRolesDto {
  if (body.resource_id !== undefined) {
    throw new AppError(400, "Send resource_id or resource_ids, not both");
  }
  if (!isPositiveInteger(body.role_id)) {
    throw new AppError(400, "role_id must be a positive integer");
  }
  const ids: unknown = body.resource_ids;
  if (!Array.isArray(ids) || !ids.every(isPositiveInteger)) {
    throw new AppError(400, "resource_ids must be an array of positive integers");
  }
  if (new Set(ids).size !== ids.length) {
    throw new AppError(400, "resource_ids must not contain duplicates");
  }
  return { role_id: body.role_id, resource_ids: ids };
}
