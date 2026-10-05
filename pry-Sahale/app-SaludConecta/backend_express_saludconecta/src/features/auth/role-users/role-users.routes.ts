import { Application } from "express";
import { RoleUsersController } from "./role-users.controller";

/**
 * Rutas del feature RoleUsers.
 *
 * Versión de construcción: todavía **sin middlewares de acceso**. `authenticate`
 * y `authorize` se insertan en ISS-21, cuando existan; ese ISS reemplaza
 * este archivo por su versión definitiva (**JWT + RBAC**).
 */
export class RoleUsersRoutes {
  public roleUsersController: RoleUsersController = new RoleUsersController();

  public routes(app: Application): void {
    // getAll
    app
      .route("/api/role-users")
      .get(this.roleUsersController.getAll.bind(this.roleUsersController));

    // getOne
    app
      .route("/api/role-users/:id")
      .get(this.roleUsersController.getOne.bind(this.roleUsersController));

    // asignar rol (create)
    app
      .route("/api/role-users")
      .post(this.roleUsersController.assign.bind(this.roleUsersController));

    // retirar rol (delete lógico)
    app
      .route("/api/role-users/:id/deactivate")
      .patch(this.roleUsersController.deactivate.bind(this.roleUsersController));

    // reactivar asignación
    app
      .route("/api/role-users/:id/reactivate")
      .patch(this.roleUsersController.reactivate.bind(this.roleUsersController));
  }
}
