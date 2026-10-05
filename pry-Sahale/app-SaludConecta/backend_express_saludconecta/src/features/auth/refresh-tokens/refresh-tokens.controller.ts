import { Request, Response } from "express";
import { BaseController } from "../../../shared/http/base-controller";
import { requireAuthUser } from "../../../shared/auth/auth-user";
import { RefreshTokensService } from "./refresh-tokens.service";

/**
 * Capa Controller del feature RefreshTokens — **modalidad JWT**.
 *
 * Todas las operaciones actúan sobre las sesiones del usuario autenticado
 * (`req.auth.id`). No exigen RBAC: poder ver y revocar **tus propias** sesiones
 * es un derecho derivado de estar autenticado, no de tener un permiso concreto.
 *
 * Orden de operaciones (con una salvedad de enrutado, ver `refresh-tokens.routes.ts`):
 * getAll → getOne → revokeAll (literal) → revokeOne → purge.
 */
export class RefreshTokensController extends BaseController {
  public constructor(private readonly service: RefreshTokensService = new RefreshTokensService()) {
    super();
  }

  // ================== READ ==================
  public async getAll(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const sessions = await this.service.getAllMine(requireAuthUser(req).id);
      res.status(200).json({ sessions });
    });
  }

  public async getOne(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const session = await this.service.getMine(requireAuthUser(req).id, this.paramId(req));
      res.status(200).json({ session });
    });
  }

  // ================== STATE (revocar) ==================
  /** Revoca **todas** las sesiones del usuario autenticado. */
  public async revokeAll(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const revoked = await this.service.revokeAllMine(requireAuthUser(req).id);
      res.status(200).json({ message: "All sessions revoked", revoked });
    });
  }

  /** Revoca una sesión propia. */
  public async revokeOne(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const session = await this.service.revokeMine(requireAuthUser(req).id, this.paramId(req));
      res.status(200).json({ message: "Session revoked", session });
    });
  }

  // ================== PURGE ==================
  /** Purga (borrado físico) las sesiones propias ya revocadas o expiradas. */
  public async purge(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const purged = await this.service.purgeMine(requireAuthUser(req).id);
      res.status(200).json({ message: "Inactive sessions purged", purged });
    });
  }
}
