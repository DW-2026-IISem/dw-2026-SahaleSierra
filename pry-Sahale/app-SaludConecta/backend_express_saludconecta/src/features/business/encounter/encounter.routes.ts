import { Application } from "express";
import { EncounterController } from "./encounter.controller";
import { authenticate, authorize } from "../../auth/access";

/**
 * Rutas del feature Encounter.
 *
 * **Modalidad 3 — JWT + RBAC**: `authenticate` resuelve la identidad (401 si no
 * hay token válido o el usuario está inactivo) y `authorize` decide sobre el par
 * `(method, path)` (403 si no hay concesión activa en la matriz de permisos).
 */
export class EncounterRoutes {
  public encounterController: EncounterController = new EncounterController();

  public routes(app: Application): void {
    // ================== RUTAS JWT + RBAC (authenticate + authorize) ==================

    // getAll
    app
      .route("/api/encounters")
      .get(authenticate, authorize, this.encounterController.getAll.bind(this.encounterController));

    // getOne
    app
      .route("/api/encounters/:id")
      .get(authenticate, authorize, this.encounterController.getOne.bind(this.encounterController));

    // create
    app
      .route("/api/encounters")
      .post(
        authenticate,
        authorize,
        this.encounterController.create.bind(this.encounterController),
      );

    // update (PUT / PATCH)
    app
      .route("/api/encounters/:id")
      .put(
        authenticate,
        authorize,
        this.encounterController.updatePut.bind(this.encounterController),
      )
      .patch(
        authenticate,
        authorize,
        this.encounterController.updatePatch.bind(this.encounterController),
      );

    // delete físico
    app
      .route("/api/encounters/:id")
      .delete(
        authenticate,
        authorize,
        this.encounterController.deletePhysical.bind(this.encounterController),
      );

    // delete lógico
    app
      .route("/api/encounters/:id/deactivate")
      .patch(
        authenticate,
        authorize,
        this.encounterController.deleteLogical.bind(this.encounterController),
      );
  }
}
