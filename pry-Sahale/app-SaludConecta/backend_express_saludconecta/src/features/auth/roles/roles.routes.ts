import { Application } from "express";
import { RolesController } from "./roles.controller";
import { authenticate, authorize } from "../access";

/** Rutas del feature Roles — **modalidad 3 (JWT + RBAC)** en todas las operaciones. */
export class RolesRoutes {
  public rolesController: RolesController = new RolesController();

  public routes(app: Application): void {
    // getAll
    app
      .route("/api/roles")
      .get(authenticate, authorize, this.rolesController.getAll.bind(this.rolesController));

    // getOne
    app
      .route("/api/roles/:id")
      .get(authenticate, authorize, this.rolesController.getOne.bind(this.rolesController));

    // create
    app
      .route("/api/roles")
      .post(authenticate, authorize, this.rolesController.create.bind(this.rolesController));

    // update (PUT / PATCH)
    app
      .route("/api/roles/:id")
      .put(authenticate, authorize, this.rolesController.updatePut.bind(this.rolesController))
      .patch(authenticate, authorize, this.rolesController.updatePatch.bind(this.rolesController));

    // delete físico
    app
      .route("/api/roles/:id")
      .delete(
        authenticate,
        authorize,
        this.rolesController.deletePhysical.bind(this.rolesController),
      );

    // delete lógico
    app
      .route("/api/roles/:id/deactivate")
      .patch(
        authenticate,
        authorize,
        this.rolesController.deleteLogical.bind(this.rolesController),
      );
  }
}
