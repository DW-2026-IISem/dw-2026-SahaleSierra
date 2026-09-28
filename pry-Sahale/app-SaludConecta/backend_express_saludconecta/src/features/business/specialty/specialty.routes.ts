import { Application } from "express";
import { SpecialtyController } from "./specialty.controller";

export class SpecialtyRoutes {
  public specialtyController: SpecialtyController = new SpecialtyController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN / SIN MIDDLEWARE JWT ==================

    // getAll
    app
      .route("/api/specialties")
      .get(this.specialtyController.getAll.bind(this.specialtyController));

    // getOne
    app
      .route("/api/specialties/:id")
      .get(this.specialtyController.getOne.bind(this.specialtyController));

    // create
    app
      .route("/api/specialties")
      .post(this.specialtyController.create.bind(this.specialtyController));

    // update (PUT / PATCH)
    app
      .route("/api/specialties/:id")
      .put(this.specialtyController.updatePut.bind(this.specialtyController))
      .patch(this.specialtyController.updatePatch.bind(this.specialtyController));

    // delete físico
    app
      .route("/api/specialties/:id")
      .delete(this.specialtyController.deletePhysical.bind(this.specialtyController));

    // delete lógico
    app
      .route("/api/specialties/:id/deactivate")
      .patch(this.specialtyController.deleteLogical.bind(this.specialtyController));
  }
}
