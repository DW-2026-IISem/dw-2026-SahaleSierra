import { Application } from "express";
import { DoctorSpecialtyController } from "./doctor-specialty.controller";

export class DoctorSpecialtyRoutes {
  public doctorSpecialtyController: DoctorSpecialtyController = new DoctorSpecialtyController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN / SIN MIDDLEWARE JWT ==================

    // getAll
    app
      .route("/api/doctor-specialties")
      .get(this.doctorSpecialtyController.getAll.bind(this.doctorSpecialtyController));

    // getOne
    app
      .route("/api/doctor-specialties/:id")
      .get(this.doctorSpecialtyController.getOne.bind(this.doctorSpecialtyController));

    // create
    app
      .route("/api/doctor-specialties")
      .post(this.doctorSpecialtyController.create.bind(this.doctorSpecialtyController));

    // update (PUT / PATCH)
    app
      .route("/api/doctor-specialties/:id")
      .put(this.doctorSpecialtyController.updatePut.bind(this.doctorSpecialtyController))
      .patch(this.doctorSpecialtyController.updatePatch.bind(this.doctorSpecialtyController));

    // delete físico
    app
      .route("/api/doctor-specialties/:id")
      .delete(this.doctorSpecialtyController.deletePhysical.bind(this.doctorSpecialtyController));

    // delete lógico
    app
      .route("/api/doctor-specialties/:id/deactivate")
      .patch(this.doctorSpecialtyController.deleteLogical.bind(this.doctorSpecialtyController));
  }
}
