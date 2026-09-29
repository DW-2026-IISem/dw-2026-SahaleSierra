import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

/**
 * Pivote N:M Doctor ↔ Specialty (tabla `doctor_specialties`).
 * Feature propio `doctor-specialty/` (mismo patrón que `product-sale/` del manual).
 * El par (doctor_id, specialty_id) es único.
 */
export interface DoctorSpecialtyI {
  id?: number;
  doctor_id: number;
  specialty_id: number;
  relation_data?: string | null;
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}

export class DoctorSpecialty extends Model {
  public id!: number;
  public doctor_id!: number;
  public specialty_id!: number;
  public relation_data!: string | null;
  public status!: "active" | "inactive";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

DoctorSpecialty.init(
  {
    doctor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    specialty_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    relation_data: {
      type: DataTypes.STRING,
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
    modelName: "DoctorSpecialty",
    tableName: "doctor_specialties",
    timestamps: true,
    indexes: [
      {
        name: "doctor_specialties_doctor_id_specialty_id_unique",
        unique: true,
        fields: ["doctor_id", "specialty_id"],
      },
    ],
  }
);
