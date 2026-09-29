import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export interface AgendaI {
  id?: number;
  name: string;
  description?: string | null;
  doctor_id: number;
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}

export class Agenda extends Model {
  public id!: number;
  public name!: string;
  public description!: string | null;
  public doctor_id!: number;
  public status!: "active" | "inactive";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Agenda.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    doctor_id: {
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
    modelName: "Agenda",
    tableName: "agendas",
    timestamps: true,
  }
);
