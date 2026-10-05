import { Application } from "express";
import { ServiceController } from "./service.controller";
import { authenticate, authorize } from "../../auth/access";

/**
 * Rutas del feature Service.
 *
 * **Modalidad 3 — JWT + RBAC**: `authenticate` resuelve la identidad (401 si no
 * hay token válido o el usuario está inactivo) y `authorize` decide sobre el par
 * `(method, path)` (403 si no hay concesión activa en la matriz de permisos).
 */
export class ServiceRoutes {
  public serviceController: ServiceController = new ServiceController();

  public routes(app: Application): void {
    // ================== RUTAS JWT + RBAC (authenticate + authorize) ==================

    // getAll
    app
      .route("/api/services")
      .get(authenticate, authorize, this.serviceController.getAll.bind(this.serviceController));

    // getOne
    app
      .route("/api/services/:id")
      .get(authenticate, authorize, this.serviceController.getOne.bind(this.serviceController));

    // create
    app
      .route("/api/services")
      .post(authenticate, authorize, this.serviceController.create.bind(this.serviceController));

    // update (PUT / PATCH)
    app
      .route("/api/services/:id")
      .put(authenticate, authorize, this.serviceController.updatePut.bind(this.serviceController))
      .patch(
        authenticate,
        authorize,
        this.serviceController.updatePatch.bind(this.serviceController),
      );

    // delete físico
    app
      .route("/api/services/:id")
      .delete(
        authenticate,
        authorize,
        this.serviceController.deletePhysical.bind(this.serviceController),
      );

    // delete lógico
    app
      .route("/api/services/:id/deactivate")
      .patch(
        authenticate,
        authorize,
        this.serviceController.deleteLogical.bind(this.serviceController),
      );
  }
}
