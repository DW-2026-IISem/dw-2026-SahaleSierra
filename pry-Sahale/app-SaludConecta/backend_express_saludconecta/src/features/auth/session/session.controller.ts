import { Request, Response } from "express";
import { BaseController } from "../../../shared/http/base-controller";
import { requireAuthUser } from "../../../shared/auth/auth-user";
import { LoginDto, LogoutSessionDto, RefreshSessionDto } from "./dto";
import { SessionService } from "./session.service";

/**
 * Capa Controller del feature Session.
 *
 * Mezcla las dos modalidades base:
 *  - `login`, `refresh` y `logout` son **OPEN** (no hay identidad previa; la
 *    credencial va en el cuerpo);
 *  - `profile` y `myPermissions` son **JWT** (la identidad la resolvió
 *    `authenticate` antes de llegar aquí).
 */
export class SessionController extends BaseController {
  public constructor(private readonly service: SessionService = new SessionService()) {
    super();
  }

  // ================== OPEN ==================
  /** Inicia sesión: credenciales -> par de tokens. */
  public async login(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const tokens = await this.service.login(req.body as LoginDto, deviceInfo(req));
      res.status(200).json(tokens);
    });
  }

  /** Renueva el access token rotando el refresh token. */
  public async refresh(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const tokens = await this.service.refresh(req.body as RefreshSessionDto, deviceInfo(req));
      res.status(200).json(tokens);
    });
  }

  /** Cierra la sesión del refresh token presentado. */
  public async logout(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      await this.service.logout(req.body as LogoutSessionDto);
      res.status(200).json({ message: "Session closed" });
    });
  }

  // ================== JWT ==================
  /** Perfil del usuario autenticado. */
  public async profile(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const user = await this.service.profile(requireAuthUser(req).id);
      res.status(200).json({ user });
    });
  }

  /** Permisos efectivos del usuario autenticado. */
  public async myPermissions(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const permissions = await this.service.myPermissions(requireAuthUser(req).id);
      res.status(200).json({ permissions });
    });
  }
}

/** `device_info` de auditoría a partir del encabezado `User-Agent`. */
function deviceInfo(req: Request): string | null {
  const value = req.headers["user-agent"];
  if (!value) return null;
  return String(value).slice(0, 500);
}
