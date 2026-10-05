import { CreationAttributes, Transaction } from "sequelize";
import { Role } from "./role.model";

/**
 * Capa Repository del feature Roles.
 * Única que habla con Sequelize (el modelo `Role`).
 */
export class RolesRepository {
  /** Todos los roles activos. */
  public async findAllActive(): Promise<Role[]> {
    return Role.findAll({ where: { status: "active" } });
  }

  /** Un rol por PK (o `null`). */
  public async findById(id: number, transaction?: Transaction): Promise<Role | null> {
    return Role.findByPk(id, { transaction });
  }

  /** Un rol por nombre normalizado a MAYÚSCULAS (o `null`). */
  public async findByName(name: string): Promise<Role | null> {
    return Role.findOne({ where: { name: name.trim().toUpperCase() } });
  }

  /** Inserta un rol. */
  public async create(data: CreationAttributes<Role>): Promise<Role> {
    return Role.create(data);
  }

  /** Persiste cambios sobre una instancia existente. */
  public async update(role: Role, data: Partial<Role>): Promise<Role> {
    return role.update(data);
  }

  /** Elimina físicamente una instancia. */
  public async delete(role: Role): Promise<void> {
    await role.destroy();
  }
}
