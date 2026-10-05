import { Application } from "express";
import { InvoiceController } from "./invoice.controller";
import { authenticate, authorize } from "../../auth/access";

/**
 * Rutas del feature Invoice.
 *
 * **Modalidad 3 — JWT + RBAC**: `authenticate` resuelve la identidad (401 si no
 * hay token válido o el usuario está inactivo) y `authorize` decide sobre el par
 * `(method, path)` (403 si no hay concesión activa en la matriz de permisos).
 */
export class InvoiceRoutes {
  public invoiceController: InvoiceController = new InvoiceController();

  public routes(app: Application): void {
    // ================== RUTAS JWT + RBAC (authenticate + authorize) ==================

    // getAll
    app
      .route("/api/invoices")
      .get(authenticate, authorize, this.invoiceController.getAll.bind(this.invoiceController));

    // getOne
    app
      .route("/api/invoices/:id")
      .get(authenticate, authorize, this.invoiceController.getOne.bind(this.invoiceController));

    // create
    app
      .route("/api/invoices")
      .post(authenticate, authorize, this.invoiceController.create.bind(this.invoiceController));

    // update (PUT / PATCH)
    app
      .route("/api/invoices/:id")
      .put(authenticate, authorize, this.invoiceController.updatePut.bind(this.invoiceController))
      .patch(
        authenticate,
        authorize,
        this.invoiceController.updatePatch.bind(this.invoiceController),
      );

    // delete físico
    app
      .route("/api/invoices/:id")
      .delete(
        authenticate,
        authorize,
        this.invoiceController.deletePhysical.bind(this.invoiceController),
      );

    // delete lógico
    app
      .route("/api/invoices/:id/deactivate")
      .patch(
        authenticate,
        authorize,
        this.invoiceController.deleteLogical.bind(this.invoiceController),
      );
  }
}
