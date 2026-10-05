import { Application } from "express";
import { AuthorizationController } from "./authorization.controller";
import { authenticate, authorize } from "../../auth/access";

/**
 * Rutas del feature Authorization.
 *
 * **Modalidad 3 — JWT + RBAC**: `authenticate` resuelve la identidad (401 si no
 * hay token válido o el usuario está inactivo) y `authorize` decide sobre el par
 * `(method, path)` (403 si no hay concesión activa en la matriz de permisos).
 */
export class AuthorizationRoutes {
  public authorizationController: AuthorizationController = new AuthorizationController();

  public routes(app: Application): void {
    // ================== RUTAS JWT + RBAC (authenticate + authorize) ==================

    // getAll
    app
      .route("/api/authorizations")
      .get(
        authenticate,
        authorize,
        this.authorizationController.getAll.bind(this.authorizationController),
      );

    // getOne
    app
      .route("/api/authorizations/:id")
      .get(
        authenticate,
        authorize,
        this.authorizationController.getOne.bind(this.authorizationController),
      );

    // create
    app
      .route("/api/authorizations")
      .post(
        authenticate,
        authorize,
        this.authorizationController.create.bind(this.authorizationController),
      );

    // update (PUT / PATCH)
    app
      .route("/api/authorizations/:id")
      .put(
        authenticate,
        authorize,
        this.authorizationController.updatePut.bind(this.authorizationController),
      )
      .patch(
        authenticate,
        authorize,
        this.authorizationController.updatePatch.bind(this.authorizationController),
      );

    // delete físico
    app
      .route("/api/authorizations/:id")
      .delete(
        authenticate,
        authorize,
        this.authorizationController.deletePhysical.bind(this.authorizationController),
      );

    // delete lógico
    app
      .route("/api/authorizations/:id/deactivate")
      .patch(
        authenticate,
        authorize,
        this.authorizationController.deleteLogical.bind(this.authorizationController),
      );
  }
}
