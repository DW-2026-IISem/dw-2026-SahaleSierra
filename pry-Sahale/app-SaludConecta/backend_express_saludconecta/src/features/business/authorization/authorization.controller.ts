import { Request, Response } from "express";
import { BaseController } from "../../../shared/http/base-controller";
import { CreateAuthorizationDto, PatchAuthorizationDto, UpdateAuthorizationDto } from "./dto";
import { AuthorizationService } from "./authorization.service";

/**
 * Capa Controller del feature Authorization.
 * Solo HTTP: lee `req`, llama al service y arma la respuesta.
 * El manejo de errores se delega en `run()` (ver `BaseController`).
 */
export class AuthorizationController extends BaseController {
  public constructor(
    private readonly service: AuthorizationService = new AuthorizationService()
  ) {
    super();
  }

  // ================== READ ==================
  public async getAll(_req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const authorizations = await this.service.getAll();
      res.status(200).json({ authorizations });
    });
  }

  public async getOne(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const authorization = await this.service.getOne(this.paramId(req));
      res.status(200).json({ authorization });
    });
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const authorization = await this.service.create(req.body as CreateAuthorizationDto);
      res.status(201).json({ authorization });
    });
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const authorization = await this.service.updatePut(
        this.paramId(req),
        req.body as UpdateAuthorizationDto
      );
      res.status(200).json({ authorization });
    });
  }

  public async updatePatch(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const authorization = await this.service.updatePatch(
        this.paramId(req),
        req.body as PatchAuthorizationDto
      );
      res.status(200).json({ authorization });
    });
  }

  // ================== DELETE ==================
  /** Eliminación física */
  public async deletePhysical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const id = this.paramId(req);
      await this.service.deletePhysical(id);
      res.status(200).json({ message: "Authorization permanently deleted", id });
    });
  }

  /** Eliminación lógica → status = inactive */
  public async deleteLogical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const authorization = await this.service.deleteLogical(this.paramId(req));
      res.status(200).json({
        message: "Authorization deactivated (logical delete)",
        authorization,
      });
    });
  }
}
