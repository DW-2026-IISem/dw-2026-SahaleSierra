import { Application } from "express";
import { UsersController } from "./users.controller";

/**
 * Rutas del feature Users.
 *
 * Versión de construcción: todavía **sin middlewares de acceso**. `authenticate`
 * y `authorize` se insertan en ISS-21, cuando existan; ese ISS reemplaza
 * este archivo por su versión definitiva (**JWT + RBAC**).
 */
export class UsersRoutes {
  public usersController: UsersController = new UsersController();

  public routes(app: Application): void {
    // getAll
    app.route("/api/users").get(this.usersController.getAll.bind(this.usersController));

    // getOne
    app.route("/api/users/:id").get(this.usersController.getOne.bind(this.usersController));

    // create
    app.route("/api/users").post(this.usersController.create.bind(this.usersController));

    // update (PUT / PATCH)
    app
      .route("/api/users/:id")
      .put(this.usersController.updatePut.bind(this.usersController))
      .patch(this.usersController.updatePatch.bind(this.usersController));

    // delete físico
    app
      .route("/api/users/:id")
      .delete(this.usersController.deletePhysical.bind(this.usersController));

    // delete lógico
    app
      .route("/api/users/:id/deactivate")
      .patch(this.usersController.deleteLogical.bind(this.usersController));

    // cambio de contraseña
    app
      .route("/api/users/:id/password")
      .patch(this.usersController.changePassword.bind(this.usersController));
  }
}
