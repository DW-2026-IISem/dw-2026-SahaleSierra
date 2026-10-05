import { Application } from "express";
import { ResourceRolesController } from "./resource-roles.controller";
import { authenticate, authorize } from "../access";

/**
 * Rutas del feature ResourceRoles — **modalidad 3 (JWT + RBAC)**.
 *
 * Es la vía administrativa para **conceder un recurso a un rol** (crear un
 * permiso):
 * `POST /api/resource-roles` con `{ role_id, resource_id }`.
 *
 * El efecto es inmediato y por datos: la siguiente petición del usuario afectado
 * ya consulta la nueva matriz. No se reinicia el servidor ni se despliega nada.
 */
export class ResourceRolesRoutes {
  public resourceRolesController: ResourceRolesController = new ResourceRolesController();

  public routes(app: Application): void {
    // getAll (filtros ?role_id= y ?resource_id=)
    app
      .route("/api/resource-roles")
      .get(
        authenticate,
        authorize,
        this.resourceRolesController.getAll.bind(this.resourceRolesController),
      );

    // getOne
    app
      .route("/api/resource-roles/:id")
      .get(
        authenticate,
        authorize,
        this.resourceRolesController.getOne.bind(this.resourceRolesController),
      );

    // conceder recurso a rol (create)
    app
      .route("/api/resource-roles")
      .post(
        authenticate,
        authorize,
        this.resourceRolesController.grant.bind(this.resourceRolesController),
      );

    // retirar permiso (delete lógico)
    app
      .route("/api/resource-roles/:id/deactivate")
      .patch(
        authenticate,
        authorize,
        this.resourceRolesController.deactivate.bind(this.resourceRolesController),
      );

    // reactivar permiso
    app
      .route("/api/resource-roles/:id/reactivate")
      .patch(
        authenticate,
        authorize,
        this.resourceRolesController.reactivate.bind(this.resourceRolesController),
      );
  }
}
