import { Application } from "express";
import { ResourcesController } from "./resources.controller";

/**
 * Rutas del feature Resources.
 *
 * Versión de construcción: todavía **sin middlewares de acceso**. `authenticate`
 * y `authorize` se insertan en ISS-21, cuando existan; ese ISS reemplaza
 * este archivo por su versión definitiva (**JWT + RBAC**).
 */
export class ResourcesRoutes {
  public resourcesController: ResourcesController = new ResourcesController();

  public routes(app: Application): void {
    // getAll
    app.route("/api/resources").get(this.resourcesController.getAll.bind(this.resourcesController));

    // getOne
    app
      .route("/api/resources/:id")
      .get(this.resourcesController.getOne.bind(this.resourcesController));

    // create
    app
      .route("/api/resources")
      .post(this.resourcesController.create.bind(this.resourcesController));

    // update (PUT / PATCH)
    app
      .route("/api/resources/:id")
      .put(this.resourcesController.updatePut.bind(this.resourcesController))
      .patch(this.resourcesController.updatePatch.bind(this.resourcesController));

    // delete físico
    app
      .route("/api/resources/:id")
      .delete(this.resourcesController.deletePhysical.bind(this.resourcesController));

    // delete lógico
    app
      .route("/api/resources/:id/deactivate")
      .patch(this.resourcesController.deleteLogical.bind(this.resourcesController));
  }
}
