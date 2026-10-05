import { Application } from "express";
import { ResourceRolesController } from "./resource-roles.controller";

/**
 * Rutas del feature ResourceRoles.
 *
 * Versión de construcción: todavía **sin middlewares de acceso**. `authenticate`
 * y `authorize` se insertan en ISS-21, cuando existan; ese ISS reemplaza
 * este archivo por su versión definitiva (**JWT + RBAC**).
 */
export class ResourceRolesRoutes {
  public resourceRolesController: ResourceRolesController = new ResourceRolesController();

  public routes(app: Application): void {
    // getAll (filtros ?role_id= y ?resource_id=)
    app
      .route("/api/resource-roles")
      .get(this.resourceRolesController.getAll.bind(this.resourceRolesController));

    // getOne
    app
      .route("/api/resource-roles/:id")
      .get(this.resourceRolesController.getOne.bind(this.resourceRolesController));

    // conceder recurso a rol (create)
    app
      .route("/api/resource-roles")
      .post(this.resourceRolesController.grant.bind(this.resourceRolesController));

    // retirar permiso (delete lógico)
    app
      .route("/api/resource-roles/:id/deactivate")
      .patch(this.resourceRolesController.deactivate.bind(this.resourceRolesController));

    // reactivar permiso
    app
      .route("/api/resource-roles/:id/reactivate")
      .patch(this.resourceRolesController.reactivate.bind(this.resourceRolesController));
  }
}
