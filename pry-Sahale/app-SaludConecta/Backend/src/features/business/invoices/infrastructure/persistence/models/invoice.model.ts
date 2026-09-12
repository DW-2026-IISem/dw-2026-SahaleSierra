import { Table, Column, Model, DataType, Default, Unique } from 'sequelize-typescript';
import { InvoiceStatus } from '../../../domain/entities/invoice.entity.js';

@Table({ tableName: 'invoices', timestamps: true, underscored: true })
export class InvoiceModel extends Model {
  @Unique
  @Column({ type: DataType.STRING(30), allowNull: false })
  declare number: string;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  declare date: Date;

  @Column({ type: DataType.DECIMAL(12, 2), allowNull: false })
  declare subtotal: number;

  @Column({ type: DataType.DECIMAL(12, 2), allowNull: false })
  declare tax: number;

  @Column({ type: DataType.DECIMAL(12, 2), allowNull: false })
  declare total: number;

  @Default(InvoiceStatus.PENDING)
  @Column({ type: DataType.STRING(20), allowNull: false })
  declare status: string;
}
