import { CreationAttributes, Transaction } from "sequelize";
import { RoleUser } from "./role-user.model";
import { Role } from "../roles/role.model";
import { User } from "../users/user.model";

/** `include` reutilizable: resumen del usuario (sin contraseña) y del rol. */
const SUMMARIES = [
  { model: User, as: "user", attributes: ["id", "username", "email"] },
  { model: Role, as: "role", attributes: ["id", "name"] },
];

/**
 * Capa Repository del feature RoleUsers (tabla `role_users`).
 * Única que habla con Sequelize. La proyección del usuario excluye `password`.
 */
export class RoleUsersRepository {
  /** Asignaciones activas (con resumen de usuario y rol). */
  public async findAllActive(): Promise<RoleUser[]> {
    return RoleUser.findAll({ where: { status: "active" }, include: SUMMARIES });
  }

  /** Una asignación por PK (o `null`). */
  public async findById(id: number, transaction?: Transaction): Promise<RoleUser | null> {
    return RoleUser.findByPk(id, { include: SUMMARIES, transaction });
  }

  /**
   * La asignación de un usuario a un rol, sea cual sea su estado.
   *
   * Permite la semántica *create-or-reactivate*: si ya existe inactiva, se
   * reactiva en lugar de chocar con la restricción única `(user_id, role_id)`.
   */
  public async findByUserAndRole(userId: number, roleId: number): Promise<RoleUser | null> {
    return RoleUser.findOne({ where: { user_id: userId, role_id: roleId } });
  }

  /** Inserta una asignación. */
  public async create(data: CreationAttributes<RoleUser>): Promise<RoleUser> {
    return RoleUser.create(data);
  }

  /** Persiste cambios sobre una instancia existente. */
  public async update(roleUser: RoleUser, data: Partial<RoleUser>): Promise<RoleUser> {
    return roleUser.update(data);
  }
}
