import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

/**
 * Factura (tabla `invoices`). Agrupa atenciones facturables (encounters.invoice_id).
 * `state` = estado de negocio (issued | paid | cancelled).
 * `status` = baja lógica del lab (active | inactive).
 */
export type InvoiceState = "issued" | "paid" | "cancelled";

export interface InvoiceI {
  id?: number;
  number: string;
  invoice_date: Date | string;
  subtotal: number;
  tax: number;
  total: number;
  state: InvoiceState;
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}

export class Invoice extends Model {
  public id!: number;
  public number!: string;
  public invoice_date!: Date;
  public subtotal!: number;
  public tax!: number;
  public total!: number;
  public state!: InvoiceState;
  public status!: "active" | "inactive";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Invoice.init(
  {
    number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    invoice_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    subtotal: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
    },
    tax: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
    },
    total: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
    },
    state: {
      type: DataTypes.ENUM("issued", "paid", "cancelled"),
      defaultValue: "issued",
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
    modelName: "Invoice",
    tableName: "invoices",
    timestamps: true,
    indexes: [
      {
        name: "invoices_number_unique",
        unique: true,
        fields: ["number"],
      },
    ],
  }
);
