import { Application } from "express";
import { InvoiceController } from "./invoice.controller";

export class InvoiceRoutes {
  public invoiceController: InvoiceController = new InvoiceController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN / SIN MIDDLEWARE JWT ==================

    // getAll
    app
      .route("/api/invoices")
      .get(this.invoiceController.getAll.bind(this.invoiceController));

    // getOne
    app
      .route("/api/invoices/:id")
      .get(this.invoiceController.getOne.bind(this.invoiceController));

    // create
    app
      .route("/api/invoices")
      .post(this.invoiceController.create.bind(this.invoiceController));

    // update (PUT / PATCH)
    app
      .route("/api/invoices/:id")
      .put(this.invoiceController.updatePut.bind(this.invoiceController))
      .patch(this.invoiceController.updatePatch.bind(this.invoiceController));

    // delete físico
    app
      .route("/api/invoices/:id")
      .delete(this.invoiceController.deletePhysical.bind(this.invoiceController));

    // delete lógico
    app
      .route("/api/invoices/:id/deactivate")
      .patch(this.invoiceController.deleteLogical.bind(this.invoiceController));
  }
}
