import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

/**
 * Autorización (tabla `authorizations`).
 * Relación Cita 0..1:1 Autorización: `appointment_id` es único (índice con nombre).
 */
export interface AuthorizationI {
  id?: number;
  name: string;
  description?: string | null;
  appointment_id: number;
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}

export class Authorization extends Model {
  public id!: number;
  public name!: string;
  public description!: string | null;
  public appointment_id!: number;
  public status!: "active" | "inactive";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Authorization.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    appointment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "inactive",
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Authorization",
    tableName: "authorizations",
    timestamps: true,
    indexes: [
      {
        name: "authorizations_appointment_id_unique",
        unique: true,
        fields: ["appointment_id"],
      },
    ],
  }
);
