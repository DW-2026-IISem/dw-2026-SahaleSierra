import { Application } from "express";
import { AuthorizationController } from "./authorization.controller";

export class AuthorizationRoutes {
  public authorizationController: AuthorizationController = new AuthorizationController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN / SIN MIDDLEWARE JWT ==================

    // getAll
    app
      .route("/api/authorizations")
      .get(this.authorizationController.getAll.bind(this.authorizationController));

    // getOne
    app
      .route("/api/authorizations/:id")
      .get(this.authorizationController.getOne.bind(this.authorizationController));

    // create
    app
      .route("/api/authorizations")
      .post(this.authorizationController.create.bind(this.authorizationController));

    // update (PUT / PATCH)
    app
      .route("/api/authorizations/:id")
      .put(this.authorizationController.updatePut.bind(this.authorizationController))
      .patch(this.authorizationController.updatePatch.bind(this.authorizationController));

    // delete físico
    app
      .route("/api/authorizations/:id")
      .delete(this.authorizationController.deletePhysical.bind(this.authorizationController));

    // delete lógico
    app
      .route("/api/authorizations/:id/deactivate")
      .patch(this.authorizationController.deleteLogical.bind(this.authorizationController));
  }
}
