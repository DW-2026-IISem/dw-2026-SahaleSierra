import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../shared/errors/app-error";
// Carga la ampliación de tipos `Request.auth`. `tsc` la encuentra sola, pero
// `ts-node` (npm run dev) compila archivo por archivo y la necesita importada.
import "../../../shared/auth/auth-user";
import { sendError } from "../../../shared/http/error-response";
import { isOperationGranted, normalizePath } from "../../../shared/auth/resource-match";
import { ResourceRolesRepository } from "../resource-roles/resource-roles.repository";

/**
 * **MODALIDAD 3 — RBAC (identidad + autorización granular).** Middleware de
 * autorización.
 *
 * Debe montarse **después** de `authenticate`. Responde a la segunda pregunta:
 * *¿puede esta identidad ejecutar `method + path`?*
 *
 * Cómo resuelve la decisión:
 *  1. Toma la identidad ya resuelta en `req.auth`.
 *  2. Consulta la **cadena completa** de autorización en la base de datos
 *     (`resource_roles → roles → role_users → resources`, todos los eslabones
 *     activos) para ese `user_id`.
 *  3. Compara el par `(method, path)` de la petición con las concesiones,
 *     por patrón (`/api/patients/:id` casa con `/api/patients/42`).
 *
 * Reglas:
 *  - **Deny by default**: sin concesión activa que cubra la operación -> 403.
 *  - **401** si no hay identidad (falta `authenticate` o el token no valió).
 *  - **403** si hay identidad válida pero no hay permiso.
 *
 * No recibe parámetros: el recurso y la acción se derivan de la propia petición.
 * Añadir un permiso es insertar filas en la base de datos, nunca tocar el código.
 */
const resourceRolesRepository = new ResourceRolesRepository();

export async function authorize(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.auth) {
      throw new AppError(401, "Authentication required");
    }

    const method = req.method.toUpperCase();
    const path = normalizePath(req.originalUrl);

    const granted = await resourceRolesRepository.findEffectiveForUser(req.auth.id);

    if (!isOperationGranted(granted, method, path)) {
      throw new AppError(403, `Forbidden: no grant for ${method} ${path}`);
    }

    next();
  } catch (error) {
    sendError(res, error);
  }
}
