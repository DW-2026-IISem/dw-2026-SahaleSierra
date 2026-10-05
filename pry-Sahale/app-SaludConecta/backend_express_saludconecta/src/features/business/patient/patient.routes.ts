import { Application } from "express";
import { PatientController } from "./patient.controller";
import { authenticate, authorize } from "../../auth/access";

/**
 * Rutas del feature Patient.
 *
 * **Modalidad 3 — JWT + RBAC**: `authenticate` resuelve la identidad (401 si no
 * hay token válido o el usuario está inactivo) y `authorize` decide sobre el par
 * `(method, path)` (403 si no hay concesión activa en la matriz de permisos).
 */
export class PatientRoutes {
  public patientController: PatientController = new PatientController();

  public routes(app: Application): void {
    // ================== RUTAS JWT + RBAC (authenticate + authorize) ==================

    // getAll
    app
      .route("/api/patients")
      .get(authenticate, authorize, this.patientController.getAll.bind(this.patientController));

    // getOne
    app
      .route("/api/patients/:id")
      .get(authenticate, authorize, this.patientController.getOne.bind(this.patientController));

    // create
    app
      .route("/api/patients")
      .post(authenticate, authorize, this.patientController.create.bind(this.patientController));

    // update (PUT / PATCH)
    app
      .route("/api/patients/:id")
      .put(authenticate, authorize, this.patientController.updatePut.bind(this.patientController))
      .patch(
        authenticate,
        authorize,
        this.patientController.updatePatch.bind(this.patientController),
      );

    // delete físico
    app
      .route("/api/patients/:id")
      .delete(
        authenticate,
        authorize,
        this.patientController.deletePhysical.bind(this.patientController),
      );

    // delete lógico
    app
      .route("/api/patients/:id/deactivate")
      .patch(
        authenticate,
        authorize,
        this.patientController.deleteLogical.bind(this.patientController),
      );
  }
}
