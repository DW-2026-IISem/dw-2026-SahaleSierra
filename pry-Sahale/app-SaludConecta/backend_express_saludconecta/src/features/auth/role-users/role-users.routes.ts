import { Application } from "express";
import { RoleUsersController } from "./role-users.controller";
import { authenticate, authorize } from "../access";

/**
 * Rutas del feature RoleUsers — **modalidad 3 (JWT + RBAC)**.
 *
 * Es la vía administrativa para **asignar un rol a un usuario**:
 * `POST /api/role-users` con `{ user_id, role_id }`.
 *
 * No hay borrado físico: retirar un rol es un borrado lógico (`/deactivate`) y
 * es reversible (`/reactivate`). La auditoría de quién tuvo qué rol se conserva.
 */
export class RoleUsersRoutes {
  public roleUsersController: RoleUsersController = new RoleUsersController();

  public routes(app: Application): void {
    // getAll
    app
      .route("/api/role-users")
      .get(authenticate, authorize, this.roleUsersController.getAll.bind(this.roleUsersController));

    // getOne
    app
      .route("/api/role-users/:id")
      .get(authenticate, authorize, this.roleUsersController.getOne.bind(this.roleUsersController));

    // asignar rol (create)
    app
      .route("/api/role-users")
      .post(
        authenticate,
        authorize,
        this.roleUsersController.assign.bind(this.roleUsersController),
      );

    // retirar rol (delete lógico)
    app
      .route("/api/role-users/:id/deactivate")
      .patch(
        authenticate,
        authorize,
        this.roleUsersController.deactivate.bind(this.roleUsersController),
      );

    // reactivar asignación
    app
      .route("/api/role-users/:id/reactivate")
      .patch(
        authenticate,
        authorize,
        this.roleUsersController.reactivate.bind(this.roleUsersController),
      );
  }
}
