import { Application } from "express";
import { AgendaController } from "./agenda.controller";

export class AgendaRoutes {
  public agendaController: AgendaController = new AgendaController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN / SIN MIDDLEWARE JWT ==================

    // getAll
    app
      .route("/api/agendas")
      .get(this.agendaController.getAll.bind(this.agendaController));

    // getOne
    app
      .route("/api/agendas/:id")
      .get(this.agendaController.getOne.bind(this.agendaController));

    // create
    app
      .route("/api/agendas")
      .post(this.agendaController.create.bind(this.agendaController));

    // update (PUT / PATCH)
    app
      .route("/api/agendas/:id")
      .put(this.agendaController.updatePut.bind(this.agendaController))
      .patch(this.agendaController.updatePatch.bind(this.agendaController));

    // delete físico
    app
      .route("/api/agendas/:id")
      .delete(this.agendaController.deletePhysical.bind(this.agendaController));

    // delete lógico
    app
      .route("/api/agendas/:id/deactivate")
      .patch(this.agendaController.deleteLogical.bind(this.agendaController));
  }
}
