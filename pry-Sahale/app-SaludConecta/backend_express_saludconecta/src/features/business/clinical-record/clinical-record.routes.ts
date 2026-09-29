import { Application } from "express";
import { ClinicalRecordController } from "./clinical-record.controller";

export class ClinicalRecordRoutes {
  public clinicalRecordController: ClinicalRecordController = new ClinicalRecordController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN / SIN MIDDLEWARE JWT ==================

    // getAll
    app
      .route("/api/clinical-records")
      .get(this.clinicalRecordController.getAll.bind(this.clinicalRecordController));

    // getOne
    app
      .route("/api/clinical-records/:id")
      .get(this.clinicalRecordController.getOne.bind(this.clinicalRecordController));

    // getByPatient (PDF: GET /historias/:pacienteId)
    app
      .route("/api/clinical-records/patient/:patientId")
      .get(this.clinicalRecordController.getByPatient.bind(this.clinicalRecordController));

    // create
    app
      .route("/api/clinical-records")
      .post(this.clinicalRecordController.create.bind(this.clinicalRecordController));

    // update (PUT / PATCH)
    app
      .route("/api/clinical-records/:id")
      .put(this.clinicalRecordController.updatePut.bind(this.clinicalRecordController))
      .patch(this.clinicalRecordController.updatePatch.bind(this.clinicalRecordController));

    // delete físico
    app
      .route("/api/clinical-records/:id")
      .delete(this.clinicalRecordController.deletePhysical.bind(this.clinicalRecordController));

    // delete lógico
    app
      .route("/api/clinical-records/:id/deactivate")
      .patch(this.clinicalRecordController.deleteLogical.bind(this.clinicalRecordController));
  }
}
