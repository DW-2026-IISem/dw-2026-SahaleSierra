import { Response } from "express";
import { AppError } from "../errors/app-error";

/**
 * Traduce cualquier error a una respuesta HTTP. **Único punto** del proyecto
 * donde se decide el mapeo error -> status.
 *
 * Lo usan los dos sitios que pueden fallar antes de llegar a un controller:
 *  - `BaseController.handleError` (handlers de los controllers);
 *  - los middlewares de acceso (`authenticate` / `authorize`), que responden
 *    401/403 sin pasar por un controller.
 *
 * Regla: `AppError` -> su `statusCode`; cualquier otra cosa -> **500** (y el
 * detalle solo en el cuerpo, nunca el stack).
 */
export function sendError(res: Response, error: unknown): void {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({ error: error.message });
    return;
  }
  res.status(500).json({ error: "Internal server error", detail: String(error) });
}
