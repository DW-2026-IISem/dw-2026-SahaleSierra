import { Application } from "express";
import { RolesController } from "./roles.controller";

/**
 * Rutas del feature Roles.
 *
 * Versión de construcción: todavía **sin middlewares de acceso**. `authenticate`
 * y `authorize` se insertan en ISS-21, cuando existan; ese ISS reemplaza
 * este archivo por su versión definitiva (**JWT + RBAC**).
 */
export class RolesRoutes {
  public rolesController: RolesController = new RolesController();

  public routes(app: Application): void {
    // getAll
    app.route("/api/roles").get(this.rolesController.getAll.bind(this.rolesController));

    // getOne
    app.route("/api/roles/:id").get(this.rolesController.getOne.bind(this.rolesController));

    // create
    app.route("/api/roles").post(this.rolesController.create.bind(this.rolesController));

    // update (PUT / PATCH)
    app
      .route("/api/roles/:id")
      .put(this.rolesController.updatePut.bind(this.rolesController))
      .patch(this.rolesController.updatePatch.bind(this.rolesController));

    // delete físico
    app
      .route("/api/roles/:id")
      .delete(this.rolesController.deletePhysical.bind(this.rolesController));

    // delete lógico
    app
      .route("/api/roles/:id/deactivate")
      .patch(this.rolesController.deleteLogical.bind(this.rolesController));
  }
}
