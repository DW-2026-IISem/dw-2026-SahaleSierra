import { Application } from "express";
import { DoctorSpecialtyController } from "./doctor-specialty.controller";
import { authenticate, authorize } from "../../auth/access";

/**
 * Rutas del feature DoctorSpecialty.
 *
 * **Modalidad 3 — JWT + RBAC**: `authenticate` resuelve la identidad (401 si no
 * hay token válido o el usuario está inactivo) y `authorize` decide sobre el par
 * `(method, path)` (403 si no hay concesión activa en la matriz de permisos).
 */
export class DoctorSpecialtyRoutes {
  public doctorSpecialtyController: DoctorSpecialtyController = new DoctorSpecialtyController();

  public routes(app: Application): void {
    // ================== RUTAS JWT + RBAC (authenticate + authorize) ==================

    // getAll
    app
      .route("/api/doctor-specialties")
      .get(
        authenticate,
        authorize,
        this.doctorSpecialtyController.getAll.bind(this.doctorSpecialtyController),
      );

    // getOne
    app
      .route("/api/doctor-specialties/:id")
      .get(
        authenticate,
        authorize,
        this.doctorSpecialtyController.getOne.bind(this.doctorSpecialtyController),
      );

    // create
    app
      .route("/api/doctor-specialties")
      .post(
        authenticate,
        authorize,
        this.doctorSpecialtyController.create.bind(this.doctorSpecialtyController),
      );

    // update (PUT / PATCH)
    app
      .route("/api/doctor-specialties/:id")
      .put(
        authenticate,
        authorize,
        this.doctorSpecialtyController.updatePut.bind(this.doctorSpecialtyController),
      )
      .patch(
        authenticate,
        authorize,
        this.doctorSpecialtyController.updatePatch.bind(this.doctorSpecialtyController),
      );

    // delete físico
    app
      .route("/api/doctor-specialties/:id")
      .delete(
        authenticate,
        authorize,
        this.doctorSpecialtyController.deletePhysical.bind(this.doctorSpecialtyController),
      );

    // delete lógico
    app
      .route("/api/doctor-specialties/:id/deactivate")
      .patch(
        authenticate,
        authorize,
        this.doctorSpecialtyController.deleteLogical.bind(this.doctorSpecialtyController),
      );
  }
}
