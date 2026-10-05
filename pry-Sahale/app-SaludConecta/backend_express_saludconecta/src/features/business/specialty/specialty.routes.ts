import { Application } from "express";
import { SpecialtyController } from "./specialty.controller";
import { authenticate, authorize } from "../../auth/access";

/**
 * Rutas del feature Specialty.
 *
 * **Modalidad 3 — JWT + RBAC**: `authenticate` resuelve la identidad (401 si no
 * hay token válido o el usuario está inactivo) y `authorize` decide sobre el par
 * `(method, path)` (403 si no hay concesión activa en la matriz de permisos).
 */
export class SpecialtyRoutes {
  public specialtyController: SpecialtyController = new SpecialtyController();

  public routes(app: Application): void {
    // ================== RUTAS JWT + RBAC (authenticate + authorize) ==================

    // getAll
    app
      .route("/api/specialties")
      .get(authenticate, authorize, this.specialtyController.getAll.bind(this.specialtyController));

    // getOne
    app
      .route("/api/specialties/:id")
      .get(authenticate, authorize, this.specialtyController.getOne.bind(this.specialtyController));

    // create
    app
      .route("/api/specialties")
      .post(
        authenticate,
        authorize,
        this.specialtyController.create.bind(this.specialtyController),
      );

    // update (PUT / PATCH)
    app
      .route("/api/specialties/:id")
      .put(
        authenticate,
        authorize,
        this.specialtyController.updatePut.bind(this.specialtyController),
      )
      .patch(
        authenticate,
        authorize,
        this.specialtyController.updatePatch.bind(this.specialtyController),
      );

    // delete físico
    app
      .route("/api/specialties/:id")
      .delete(
        authenticate,
        authorize,
        this.specialtyController.deletePhysical.bind(this.specialtyController),
      );

    // delete lógico
    app
      .route("/api/specialties/:id/deactivate")
      .patch(
        authenticate,
        authorize,
        this.specialtyController.deleteLogical.bind(this.specialtyController),
      );
  }
}
