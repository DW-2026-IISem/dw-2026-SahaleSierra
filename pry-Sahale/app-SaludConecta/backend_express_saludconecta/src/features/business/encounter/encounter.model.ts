import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

/**
 * Atención (tabla `encounters`).
 * Cita 0..1:1 Atención (`appointment_id` único), HistoriaClinica 1:N Atención,
 * Servicio 1:N Atención.
 * `state` = estado de negocio (in_progress | completed | cancelled).
 * `status` = baja lógica del lab (active | inactive).
 */
export type EncounterState = "in_progress" | "completed" | "cancelled";

export interface EncounterI {
  id?: number;
  appointment_id: number;
  clinical_record_id: number;
  service_id: number;
  start_date: Date | string;
  end_date?: Date | string | null;
  total: number;
  state: EncounterState;
  observations?: string | null;
  invoice_id?: number | null;
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}

export class Encounter extends Model {
  public id!: number;
  public appointment_id!: number;
  public clinical_record_id!: number;
  public service_id!: number;
  public start_date!: Date;
  public end_date!: Date | null;
  public total!: number;
  public state!: EncounterState;
  public observations!: string | null;
  public invoice_id!: number | null;
  public status!: "active" | "inactive";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Encounter.init(
  {
    appointment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    clinical_record_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    total: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
    },
    state: {
      type: DataTypes.ENUM("in_progress", "completed", "cancelled"),
      defaultValue: "in_progress",
      allowNull: false,
    },
    observations: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    invoice_id: {
      type: DataTypes.INTEGER,
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
    modelName: "Encounter",
    tableName: "encounters",
    timestamps: true,
    indexes: [
      {
        name: "encounters_appointment_id_unique",
        unique: true,
        fields: ["appointment_id"],
      },
    ],
  }
);
