import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export interface PatientI {
  id?: number;
  document_type: string;
  document_number: string;
  name: string;
  birth_date: Date | string;
  contact: string;
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}

export class Patient extends Model {
  public id!: number;
  public document_type!: string;
  public document_number!: string;
  public name!: string;
  public birth_date!: string;
  public contact!: string;
  public status!: "active" | "inactive";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Patient.init(
  {
    document_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    document_number: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: { msg: "Document number cannot be empty" },
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    birth_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      validate: {
        isDate: { args: true, msg: "Birth date must be a valid date" },
      },
    },
    contact: {
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
    modelName: "Patient",
     tableName: "patients",
    timestamps: true,
    indexes: [
      {
        name: "patients_document_number_unique",
        unique: true,
        fields: ["document_number"],
      },
    ],
  }
);
