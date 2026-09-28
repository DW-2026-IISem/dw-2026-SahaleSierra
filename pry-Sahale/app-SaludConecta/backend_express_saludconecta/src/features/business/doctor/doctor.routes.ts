import { Application } from "express";
import { DoctorController } from "./doctor.controller";

export class DoctorRoutes {
  public doctorController: DoctorController = new DoctorController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN / SIN MIDDLEWARE JWT ==================

    // getAll
    app
      .route("/api/doctors")
      .get(this.doctorController.getAll.bind(this.doctorController));

    // getOne
    app
      .route("/api/doctors/:id")
      .get(this.doctorController.getOne.bind(this.doctorController));

    // create
    app
      .route("/api/doctors")
      .post(this.doctorController.create.bind(this.doctorController));

    // update (PUT / PATCH)
    app
      .route("/api/doctors/:id")
      .put(this.doctorController.updatePut.bind(this.doctorController))
      .patch(this.doctorController.updatePatch.bind(this.doctorController));

    // delete físico
    app
      .route("/api/doctors/:id")
      .delete(this.doctorController.deletePhysical.bind(this.doctorController));

    // delete lógico
    app
      .route("/api/doctors/:id/deactivate")
      .patch(this.doctorController.deleteLogical.bind(this.doctorController));
  }
}
