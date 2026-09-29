import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

/**
 * Historia clínica (tabla `clinical_records`).
 * Relación 1:1 con Patient: `patient_id` es único (índice con nombre).
 */
export interface ClinicalRecordI {
  id?: number;
  name: string;
  description?: string | null;
  patient_id: number;
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}

export class ClinicalRecord extends Model {
  public id!: number;
  public name!: string;
  public description!: string | null;
  public patient_id!: number;
  public status!: "active" | "inactive";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ClinicalRecord.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    modelName: "ClinicalRecord",
    tableName: "clinical_records",
    timestamps: true,
    indexes: [
      {
        name: "clinical_records_patient_id_unique",
        unique: true,
        fields: ["patient_id"],
      },
    ],
  }
);
