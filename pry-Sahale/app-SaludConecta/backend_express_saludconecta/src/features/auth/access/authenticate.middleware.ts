import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../shared/errors/app-error";
// Carga la ampliación de tipos `Request.auth`. `tsc` la encuentra sola, pero
// `ts-node` (npm run dev) compila archivo por archivo y la necesita importada.
import "../../../shared/auth/auth-user";
import { sendError } from "../../../shared/http/error-response";
import { extractBearerToken, verifyAccessToken } from "../../../shared/auth/jwt";
import { UsersRepository } from "../users/users.repository";

/**
 * **MODALIDAD 2 — JWT (identidad).** Middleware de autenticación.
 *
 * Responde únicamente a la pregunta **¿quién eres?**:
 *
 *  1. Lee el token de `Authorization: Bearer <token>` (RFC 6750).
 *  2. Verifica firma, algoritmo, `iss`, `aud`, `exp` (RFC 8725).
 *  3. **Revalida contra la base de datos** que el usuario sigue existiendo y con
 *     `status = active`. Un token firmado sigue siendo válido después de
 *     desactivar la cuenta; esta revalidación hace que la desactivación tenga
 *     efecto inmediato.
 *
 * NO consulta la matriz de permisos: eso es responsabilidad de `authorize`.
 * Si todo va bien, deja la identidad en `req.auth` y cede el paso.
 *
 * Cualquier fallo se responde con **401 (no autenticado)**.
 */
const usersRepository = new UsersRepository();

export async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = extractBearerToken(req.headers.authorization);
    if (!token) {
      throw new AppError(401, "Missing Bearer token");
    }

    const payload = verifyAccessToken(token);

    // Defensa en profundidad: `verifyAccessToken` ya garantiza que `sub` es un
    // entero positivo. Se vuelve a comprobar para que ningún cambio futuro en la
    // verificación pueda enviar un `NaN` al repositorio (500 en vez de 401).
    const userId = Number(payload.sub);
    if (!Number.isInteger(userId) || userId < 1) {
      throw new AppError(401, "Invalid or expired access token");
    }

    const user = await usersRepository.findById(userId);

    if (!user || user.status !== "active") {
      throw new AppError(401, "User is not active");
    }

    req.auth = {
      id: user.id,
      username: user.username,
      email: user.email,
      tokenId: payload.jti,
    };
    next();
  } catch (error) {
    sendError(res, error);
  }
}
