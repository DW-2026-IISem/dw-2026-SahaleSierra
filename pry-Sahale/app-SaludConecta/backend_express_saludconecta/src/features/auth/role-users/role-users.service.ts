import { CreateRoleUserDto, RoleUserResponseDto, toRoleUserResponse } from "./dto";
import { RoleUsersRepository } from "./role-users.repository";
import { RoleUser } from "./role-user.model";
import { UsersRepository } from "../users/users.repository";
import { RolesRepository } from "../roles/roles.repository";
import { AppError } from "../../../shared/errors/app-error";

/**
 * Capa Service del feature RoleUsers — **asignaciones usuario ↔ rol**.
 *
 * Aquí empieza la administración de la autorización. Reglas de negocio:
 *  - Solo se asigna un rol **activo** a un usuario **activo** (un eslabón
 *    inactivo rompería la cadena y el permiso no se concedería de todos modos).
 *  - Asignar es **idempotente**: si la pareja ya existía desactivada, se
 *    reactiva; si ya estaba activa, se informa 409 sin duplicar filas.
 *  - Retirar es un borrado lógico: preserva la auditoría y es reversible.
 *
 * El efecto es inmediato: la próxima petición del usuario vuelve a consultar la
 * cadena RBAC y ya ve (o deja de ver) el permiso. No hay caché que invalidar.
 */
export class RoleUsersService {
  public constructor(
    private readonly repository: RoleUsersRepository = new RoleUsersRepository(),
    private readonly usersRepository: UsersRepository = new UsersRepository(),
    private readonly rolesRepository: RolesRepository = new RolesRepository(),
  ) {}

  // ================== READ ==================
  public async getAll(): Promise<RoleUserResponseDto[]> {
    const assignments = await this.repository.findAllActive();
    return assignments.map((assignment) => toRoleUserResponse(assignment));
  }

  public async getOne(id: number): Promise<RoleUserResponseDto> {
    return toRoleUserResponse(await this.findOrFail(id));
  }

  // ================== CREATE (asignar) ==================
  /** Asigna un rol a un usuario (o reactiva la asignación existente). */
  public async assign(body: CreateRoleUserDto): Promise<RoleUserResponseDto> {
    if (!body.user_id || !body.role_id) {
      throw new AppError(400, "user_id and role_id are required");
    }

    await this.assertUserActive(body.user_id);
    await this.assertRoleActive(body.role_id);

    const existing = await this.repository.findByUserAndRole(body.user_id, body.role_id);
    if (existing) {
      if (existing.status === "active") {
        throw new AppError(409, "Role is already assigned to this user");
      }
      const reactivated = await this.repository.update(existing, { status: "active" });
      return toRoleUserResponse(await this.reload(reactivated.id));
    }

    const created = await this.repository.create({
      user_id: body.user_id,
      role_id: body.role_id,
      status: "active",
    });
    return toRoleUserResponse(await this.reload(created.id));
  }

  // ================== STATE (retirar / reactivar) ==================
  /** Retirar el rol -> `status = inactive`. El usuario pierde los permisos del rol. */
  public async deactivate(id: number): Promise<RoleUserResponseDto> {
    const assignment = await this.findOrFail(id);
    await this.repository.update(assignment, { status: "inactive" });
    return toRoleUserResponse(await this.reload(assignment.id));
  }

  /** Reactivar la asignación. */
  public async reactivate(id: number): Promise<RoleUserResponseDto> {
    const assignment = await this.findOrFail(id, false);
    if (assignment.status === "active") {
      throw new AppError(409, "Assignment is already active");
    }
    await this.repository.update(assignment, { status: "active" });
    return toRoleUserResponse(await this.reload(assignment.id));
  }

  // ================== HELPERS ==================
  private async findOrFail(id: number, onlyActive = true): Promise<RoleUser> {
    const assignment = await this.repository.findById(id);
    if (!assignment || (onlyActive && assignment.status !== "active")) {
      throw new AppError(404, "Role assignment not found");
    }
    return assignment;
  }

  /** Recarga con los `include` de resumen (el `findById` ya los trae). */
  private async reload(id: number): Promise<RoleUser> {
    const assignment = await this.repository.findById(id);
    if (!assignment) {
      throw new AppError(404, "Role assignment not found");
    }
    return assignment;
  }

  private async assertUserActive(userId: number): Promise<void> {
    const user = await this.usersRepository.findById(userId);
    if (!user || user.status !== "active") {
      throw new AppError(404, "User not found or inactive");
    }
  }

  private async assertRoleActive(roleId: number): Promise<void> {
    const role = await this.rolesRepository.findById(roleId);
    if (!role || role.status !== "active") {
      throw new AppError(404, "Role not found or inactive");
    }
  }
}
