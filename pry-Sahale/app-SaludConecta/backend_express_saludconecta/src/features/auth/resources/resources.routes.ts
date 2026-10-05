import { Application } from "express";
import { ResourcesController } from "./resources.controller";
import { authenticate, authorize } from "../access";

/** Rutas del feature Resources — **modalidad 3 (JWT + RBAC)** en todas las operaciones. */
export class ResourcesRoutes {
  public resourcesController: ResourcesController = new ResourcesController();

  public routes(app: Application): void {
    // getAll
    app
      .route("/api/resources")
      .get(authenticate, authorize, this.resourcesController.getAll.bind(this.resourcesController));

    // getOne
    app
      .route("/api/resources/:id")
      .get(authenticate, authorize, this.resourcesController.getOne.bind(this.resourcesController));

    // create
    app
      .route("/api/resources")
      .post(
        authenticate,
        authorize,
        this.resourcesController.create.bind(this.resourcesController),
      );

    // update (PUT / PATCH)
    app
      .route("/api/resources/:id")
      .put(
        authenticate,
        authorize,
        this.resourcesController.updatePut.bind(this.resourcesController),
      )
      .patch(
        authenticate,
        authorize,
        this.resourcesController.updatePatch.bind(this.resourcesController),
      );

    // delete físico
    app
      .route("/api/resources/:id")
      .delete(
        authenticate,
        authorize,
        this.resourcesController.deletePhysical.bind(this.resourcesController),
      );

    // delete lógico
    app
      .route("/api/resources/:id/deactivate")
      .patch(
        authenticate,
        authorize,
        this.resourcesController.deleteLogical.bind(this.resourcesController),
      );
  }
}
