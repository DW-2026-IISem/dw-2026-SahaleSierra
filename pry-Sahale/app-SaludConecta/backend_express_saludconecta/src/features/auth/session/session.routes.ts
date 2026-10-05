import { Application } from "express";
import { SessionController } from "./session.controller";
import { authenticate } from "../access";

/**
 * Rutas del feature Session — **las tres modalidades en un solo archivo**.
 *
 * | Ruta | Modalidad | Middleware |
 * |---|---|---|
 * | `POST /api/session/login`  | OPEN | — |
 * | `POST /api/session/refresh` | OPEN (credencial de sesión) | — |
 * | `POST /api/session/logout`  | OPEN (credencial de sesión) | — |
 * | `GET  /api/session/profile`  | JWT | `authenticate` |
 * | `GET  /api/permissions`  | JWT | `authenticate` |
 *
 * Ninguna lleva `authorize`: la autorización granular no aplica a los puntos de
 * acceso previos o ajenos a la matriz de permisos. `/api/permissions` devuelve, eso
 * sí, **los permisos efectivos** del usuario autenticado (la misma consulta que
 * usa el middleware `authorize`), lo que lo hace ideal para depurar el RBAC.
 */
export class SessionRoutes {
  public sessionController: SessionController = new SessionController();

  public routes(app: Application): void {
    // login (OPEN)
    app.route("/api/session/login").post(this.sessionController.login.bind(this.sessionController));

    // refresh (OPEN + refresh token)
    app
      .route("/api/session/refresh")
      .post(this.sessionController.refresh.bind(this.sessionController));

    // logout (OPEN + refresh token)
    app
      .route("/api/session/logout")
      .post(this.sessionController.logout.bind(this.sessionController));

    // perfil (JWT)
    app
      .route("/api/session/profile")
      .get(authenticate, this.sessionController.profile.bind(this.sessionController));

    // permisos efectivos del usuario autenticado (JWT)
    app
      .route("/api/permissions")
      .get(authenticate, this.sessionController.myPermissions.bind(this.sessionController));
  }
}
