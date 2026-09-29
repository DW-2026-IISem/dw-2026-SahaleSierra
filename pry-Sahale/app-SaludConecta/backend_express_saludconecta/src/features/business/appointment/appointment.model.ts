import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

/**
 * Cita (tabla `appointments`).
 * `state` = estado de negocio (scheduled | attended | cancelled).
 * `status` = baja lógica del lab (active | inactive).
 */
export type AppointmentState = "scheduled" | "attended" | "cancelled";

export interface AppointmentI {
  id?: number;
  start_date: Date | string;
  end_date: Date | string;
  reason?: string | null;
  state: AppointmentState;
  agenda_id: number;
  patient_id: number;
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}

export class Appointment extends Model {
  public id!: number;
  public start_date!: Date;
  public end_date!: Date;
  public reason!: string | null;
  public state!: AppointmentState;
  public agenda_id!: number;
  public patient_id!: number;
  public status!: "active" | "inactive";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Appointment.init(
  {
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.ENUM("scheduled", "attended", "cancelled"),
      defaultValue: "scheduled",
      allowNull: false,
    },
    agenda_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    patient_id: {
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
    modelName: "Appointment",
    tableName: "appointments",
    timestamps: true,
  }
);
