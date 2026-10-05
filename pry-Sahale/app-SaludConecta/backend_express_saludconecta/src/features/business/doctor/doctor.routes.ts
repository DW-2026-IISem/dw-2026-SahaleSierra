import { Application } from "express";
import { DoctorController } from "./doctor.controller";
import { authenticate, authorize } from "../../auth/access";

/**
 * Rutas del feature Doctor.
 *
 * **Modalidad 3 — JWT + RBAC**: `authenticate` resuelve la identidad (401 si no
 * hay token válido o el usuario está inactivo) y `authorize` decide sobre el par
 * `(method, path)` (403 si no hay concesión activa en la matriz de permisos).
 */
export class DoctorRoutes {
  public doctorController: DoctorController = new DoctorController();

  public routes(app: Application): void {
    // ================== RUTAS JWT + RBAC (authenticate + authorize) ==================

    // getAll
    app
      .route("/api/doctors")
      .get(authenticate, authorize, this.doctorController.getAll.bind(this.doctorController));

    // getOne
    app
      .route("/api/doctors/:id")
      .get(authenticate, authorize, this.doctorController.getOne.bind(this.doctorController));

    // create
    app
      .route("/api/doctors")
      .post(authenticate, authorize, this.doctorController.create.bind(this.doctorController));

    // update (PUT / PATCH)
    app
      .route("/api/doctors/:id")
      .put(authenticate, authorize, this.doctorController.updatePut.bind(this.doctorController))
      .patch(
        authenticate,
        authorize,
        this.doctorController.updatePatch.bind(this.doctorController),
      );

    // delete físico
    app
      .route("/api/doctors/:id")
      .delete(
        authenticate,
        authorize,
        this.doctorController.deletePhysical.bind(this.doctorController),
      );

    // delete lógico
    app
      .route("/api/doctors/:id/deactivate")
      .patch(
        authenticate,
        authorize,
        this.doctorController.deleteLogical.bind(this.doctorController),
      );
  }
}
