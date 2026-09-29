import { Application } from "express";
import { ServiceController } from "./service.controller";

export class ServiceRoutes {
  public serviceController: ServiceController = new ServiceController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN / SIN MIDDLEWARE JWT ==================

    // getAll
    app
      .route("/api/services")
      .get(this.serviceController.getAll.bind(this.serviceController));

    // getOne
    app
      .route("/api/services/:id")
      .get(this.serviceController.getOne.bind(this.serviceController));

    // create
    app
      .route("/api/services")
      .post(this.serviceController.create.bind(this.serviceController));

    // update (PUT / PATCH)
    app
      .route("/api/services/:id")
      .put(this.serviceController.updatePut.bind(this.serviceController))
      .patch(this.serviceController.updatePatch.bind(this.serviceController));

    // delete físico
    app
      .route("/api/services/:id")
      .delete(this.serviceController.deletePhysical.bind(this.serviceController));

    // delete lógico
    app
      .route("/api/services/:id/deactivate")
      .patch(this.serviceController.deleteLogical.bind(this.serviceController));
  }
}
