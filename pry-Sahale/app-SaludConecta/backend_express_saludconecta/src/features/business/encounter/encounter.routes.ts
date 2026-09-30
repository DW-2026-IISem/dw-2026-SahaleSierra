import { Application } from "express";
import { EncounterController } from "./encounter.controller";

export class EncounterRoutes {
  public encounterController: EncounterController = new EncounterController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN / SIN MIDDLEWARE JWT ==================

    // getAll
    app
      .route("/api/encounters")
      .get(this.encounterController.getAll.bind(this.encounterController));

    // getOne
    app
      .route("/api/encounters/:id")
      .get(this.encounterController.getOne.bind(this.encounterController));

    // create
    app
      .route("/api/encounters")
      .post(this.encounterController.create.bind(this.encounterController));

    // update (PUT / PATCH)
    app
      .route("/api/encounters/:id")
      .put(this.encounterController.updatePut.bind(this.encounterController))
      .patch(this.encounterController.updatePatch.bind(this.encounterController));

    // delete físico
    app
      .route("/api/encounters/:id")
      .delete(this.encounterController.deletePhysical.bind(this.encounterController));

    // delete lógico
    app
      .route("/api/encounters/:id/deactivate")
      .patch(this.encounterController.deleteLogical.bind(this.encounterController));
  }
}
