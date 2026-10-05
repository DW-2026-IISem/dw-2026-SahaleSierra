import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

/**
 * Modelo `Role` (tabla `roles`) — agrupador lógico de responsabilidades.
 *
 * Nota de diseño: **el nombre del rol no autoriza nada**. La autorización se
 * decide por las concesiones (`resource_roles`) asociadas al rol. Un rol
 * `ADMIN` sin concesiones activas no habilita ninguna operación.
 */
export interface RoleI {
  id?: number;
  name: string;
  description?: string | null;
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}

export class Role extends Model {
  public id!: number;
  public name!: string;
  public description!: string | null;
  public status!: "active" | "inactive";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Role.init(
  {
    name: {
      type: DataTypes.STRING(80),
      allowNull: false,
      unique: "uq_roles_name",
      validate: {
        notEmpty: { msg: "Role name cannot be empty" },
      },
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "inactive",
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Role",
    tableName: "roles",
    timestamps: true,
    hooks: {
      // El nombre del rol se normaliza a MAYÚSCULAS (ADMIN, MEDICO, FACTURACION):
      // es un identificador funcional, no una etiqueta libre.
      beforeValidate: (role: Role) => {
        if (role.name) role.name = role.name.trim().toUpperCase();
      },
    },
  },
);
