import { CreateRoleDto, PatchRoleDto, RoleResponseDto, UpdateRoleDto, toRoleResponse } from "./dto";
import { RolesRepository } from "./roles.repository";
import { Role } from "./role.model";
import { AppError } from "../../../shared/errors/app-error";

/**
 * Capa Service del feature Roles.
 *
 * Regla de negocio: el nombre del rol es único. La autorización **nunca** se
 * decide por el nombre, sino por las concesiones (`resource_roles`) asociadas;
 * el nombre solo sirve para agrupar.
 */
export class RolesService {
  public constructor(private readonly repository: RolesRepository = new RolesRepository()) {}

  // ================== READ ==================
  public async getAll(): Promise<RoleResponseDto[]> {
    const roles = await this.repository.findAllActive();
    return roles.map((role) => toRoleResponse(role));
  }

  public async getOne(id: number): Promise<RoleResponseDto> {
    return toRoleResponse(await this.findOrFail(id));
  }

  // ================== CREATE ==================
  public async create(body: CreateRoleDto): Promise<RoleResponseDto> {
    if (!body.name) {
      throw new AppError(400, "name is required");
    }
    await this.assertNameAvailable(body.name);

    const role = await this.repository.create({
      name: body.name,
      description: body.description ?? null,
      status: body.status ?? "active",
    });
    return toRoleResponse(role);
  }

  // ================== UPDATE ==================
  public async updatePut(id: number, body: UpdateRoleDto): Promise<RoleResponseDto> {
    const role = await this.findOrFail(id);
    await this.assertNameAvailable(body.name, id);

    await this.repository.update(role, {
      name: body.name,
      description: body.description ?? null,
    });
    return toRoleResponse(role);
  }

  public async updatePatch(id: number, body: PatchRoleDto): Promise<RoleResponseDto> {
    const role = await this.findOrFail(id);

    if (body.name) {
      await this.assertNameAvailable(body.name, id);
    }

    await this.repository.update(role, body);
    return toRoleResponse(role);
  }

  // ================== DELETE ==================
  /** Eliminación física. */
  public async deletePhysical(id: number): Promise<void> {
    const role = await this.findOrFail(id, false);
    await this.repository.delete(role);
  }

  /** Eliminación lógica -> `status = inactive`. Todos sus usuarios pierden ese rol. */
  public async deleteLogical(id: number): Promise<RoleResponseDto> {
    const role = await this.findOrFail(id);
    await this.repository.update(role, { status: "inactive" });
    return toRoleResponse(role);
  }

  // ================== HELPERS ==================
  private async findOrFail(id: number, onlyActive = true): Promise<Role> {
    const role = await this.repository.findById(id);
    if (!role || (onlyActive && role.status !== "active")) {
      throw new AppError(404, "Role not found");
    }
    return role;
  }

  private async assertNameAvailable(name: string, excludeId?: number): Promise<void> {
    const existing = await this.repository.findByName(name);
    if (existing && existing.id !== excludeId) {
      throw new AppError(409, "Role name already in use");
    }
  }
}
