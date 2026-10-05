import { Application } from "express";
import { AgendaController } from "./agenda.controller";
import { authenticate, authorize } from "../../auth/access";

/**
 * Rutas del feature Agenda.
 *
 * **Modalidad 3 — JWT + RBAC**: `authenticate` resuelve la identidad (401 si no
 * hay token válido o el usuario está inactivo) y `authorize` decide sobre el par
 * `(method, path)` (403 si no hay concesión activa en la matriz de permisos).
 */
export class AgendaRoutes {
  public agendaController: AgendaController = new AgendaController();

  public routes(app: Application): void {
    // ================== RUTAS JWT + RBAC (authenticate + authorize) ==================

    // getAll
    app
      .route("/api/agendas")
      .get(authenticate, authorize, this.agendaController.getAll.bind(this.agendaController));

    // getOne
    app
      .route("/api/agendas/:id")
      .get(authenticate, authorize, this.agendaController.getOne.bind(this.agendaController));

    // create
    app
      .route("/api/agendas")
      .post(authenticate, authorize, this.agendaController.create.bind(this.agendaController));

    // update (PUT / PATCH)
    app
      .route("/api/agendas/:id")
      .put(authenticate, authorize, this.agendaController.updatePut.bind(this.agendaController))
      .patch(
        authenticate,
        authorize,
        this.agendaController.updatePatch.bind(this.agendaController),
      );

    // delete físico
    app
      .route("/api/agendas/:id")
      .delete(
        authenticate,
        authorize,
        this.agendaController.deletePhysical.bind(this.agendaController),
      );

    // delete lógico
    app
      .route("/api/agendas/:id/deactivate")
      .patch(
        authenticate,
        authorize,
        this.agendaController.deleteLogical.bind(this.agendaController),
      );
  }
}
