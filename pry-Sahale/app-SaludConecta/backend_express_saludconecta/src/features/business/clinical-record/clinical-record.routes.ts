import { Application } from "express";
import { ClinicalRecordController } from "./clinical-record.controller";
import { authenticate, authorize } from "../../auth/access";

/**
 * Rutas del feature ClinicalRecord.
 *
 * **Modalidad 3 — JWT + RBAC**: `authenticate` resuelve la identidad (401 si no
 * hay token válido o el usuario está inactivo) y `authorize` decide sobre el par
 * `(method, path)` (403 si no hay concesión activa en la matriz de permisos).
 */
export class ClinicalRecordRoutes {
  public clinicalRecordController: ClinicalRecordController = new ClinicalRecordController();

  public routes(app: Application): void {
    // ================== RUTAS JWT + RBAC (authenticate + authorize) ==================

    // getAll
    app
      .route("/api/clinical-records")
      .get(
        authenticate,
        authorize,
        this.clinicalRecordController.getAll.bind(this.clinicalRecordController),
      );

    // getOne
    app
      .route("/api/clinical-records/:id")
      .get(
        authenticate,
        authorize,
        this.clinicalRecordController.getOne.bind(this.clinicalRecordController),
      );

    // getByPatient (PDF: GET /historias/:pacienteId)
    app
      .route("/api/clinical-records/patient/:patientId")
      .get(
        authenticate,
        authorize,
        this.clinicalRecordController.getByPatient.bind(this.clinicalRecordController),
      );

    // create
    app
      .route("/api/clinical-records")
      .post(
        authenticate,
        authorize,
        this.clinicalRecordController.create.bind(this.clinicalRecordController),
      );

    // update (PUT / PATCH)
    app
      .route("/api/clinical-records/:id")
      .put(
        authenticate,
        authorize,
        this.clinicalRecordController.updatePut.bind(this.clinicalRecordController),
      )
      .patch(
        authenticate,
        authorize,
        this.clinicalRecordController.updatePatch.bind(this.clinicalRecordController),
      );

    // delete físico
    app
      .route("/api/clinical-records/:id")
      .delete(
        authenticate,
        authorize,
        this.clinicalRecordController.deletePhysical.bind(this.clinicalRecordController),
      );

    // delete lógico
    app
      .route("/api/clinical-records/:id/deactivate")
      .patch(
        authenticate,
        authorize,
        this.clinicalRecordController.deleteLogical.bind(this.clinicalRecordController),
      );
  }
}
