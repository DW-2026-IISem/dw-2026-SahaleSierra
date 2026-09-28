import { Application } from "express";
import { PatientController } from "./patient.controller";

export class PatientRoutes {
  public patientController: PatientController = new PatientController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN / SIN MIDDLEWARE JWT ==================
   
    // getAll
    app
      .route("/api/patients")
      .get(this.patientController.getAll.bind(this.patientController));

    // getOne
    app
      .route("/api/patients/:id")
      .get(this.patientController.getOne.bind(this.patientController));
    
    // create
    app
      .route("/api/patients")
      .post(this.patientController.create.bind(this.patientController));
  }
}
