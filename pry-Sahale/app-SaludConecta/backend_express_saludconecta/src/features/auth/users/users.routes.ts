import { Application } from "express";
import { UsersController } from "./users.controller";
import { authenticate, authorize } from "../access";

/**
 * Rutas del feature Users — **modalidad 3 (JWT + RBAC)** en todas las operaciones.
 *
 * La administración de identidades está ella misma protegida por la matriz de
 * permisos: no basta con estar autenticado, hay que tener la concesión concreta
 * (`GET /api/users`, `POST /api/users`, ...). El catálogo de recursos ya
 * incluye las 9 operaciones de este feature.
 */
export class UsersRoutes {
  public usersController: UsersController = new UsersController();

  public routes(app: Application): void {
    // getAll
    app
      .route("/api/users")
      .get(authenticate, authorize, this.usersController.getAll.bind(this.usersController));

    // getOne
    app
      .route("/api/users/:id")
      .get(authenticate, authorize, this.usersController.getOne.bind(this.usersController));

    // create
    app
      .route("/api/users")
      .post(authenticate, authorize, this.usersController.create.bind(this.usersController));

    // update (PUT / PATCH)
    app
      .route("/api/users/:id")
      .put(authenticate, authorize, this.usersController.updatePut.bind(this.usersController))
      .patch(authenticate, authorize, this.usersController.updatePatch.bind(this.usersController));

    // delete físico
    app
      .route("/api/users/:id")
      .delete(
        authenticate,
        authorize,
        this.usersController.deletePhysical.bind(this.usersController),
      );

    // delete lógico
    app
      .route("/api/users/:id/deactivate")
      .patch(
        authenticate,
        authorize,
        this.usersController.deleteLogical.bind(this.usersController),
      );

    // cambio de contraseña
    app
      .route("/api/users/:id/password")
      .patch(
        authenticate,
        authorize,
        this.usersController.changePassword.bind(this.usersController),
      );

    // permisos efectivos del usuario
    app
      .route("/api/users/:id/permissions")
      .get(
        authenticate,
        authorize,
        this.usersController.getEffectivePermissions.bind(this.usersController),
      );
  }
}
