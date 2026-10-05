import { Application } from "express";
import { AppointmentController } from "./appointment.controller";
import { authenticate, authorize } from "../../auth/access";

/**
 * Rutas del feature Appointment.
 *
 * **Modalidad 3 — JWT + RBAC**: `authenticate` resuelve la identidad (401 si no
 * hay token válido o el usuario está inactivo) y `authorize` decide sobre el par
 * `(method, path)` (403 si no hay concesión activa en la matriz de permisos).
 */
export class AppointmentRoutes {
  public appointmentController: AppointmentController = new AppointmentController();

  public routes(app: Application): void {
    // ================== RUTAS JWT + RBAC (authenticate + authorize) ==================

    // getAll
    app
      .route("/api/appointments")
      .get(
        authenticate,
        authorize,
        this.appointmentController.getAll.bind(this.appointmentController),
      );

    // getOne
    app
      .route("/api/appointments/:id")
      .get(
        authenticate,
        authorize,
        this.appointmentController.getOne.bind(this.appointmentController),
      );

    // create
    app
      .route("/api/appointments")
      .post(
        authenticate,
        authorize,
        this.appointmentController.create.bind(this.appointmentController),
      );

    // update (PUT / PATCH)
    app
      .route("/api/appointments/:id")
      .put(
        authenticate,
        authorize,
        this.appointmentController.updatePut.bind(this.appointmentController),
      )
      .patch(
        authenticate,
        authorize,
        this.appointmentController.updatePatch.bind(this.appointmentController),
      );

    // delete físico
    app
      .route("/api/appointments/:id")
      .delete(
        authenticate,
        authorize,
        this.appointmentController.deletePhysical.bind(this.appointmentController),
      );

    // delete lógico
    app
      .route("/api/appointments/:id/deactivate")
      .patch(
        authenticate,
        authorize,
        this.appointmentController.deleteLogical.bind(this.appointmentController),
      );
  }
}
