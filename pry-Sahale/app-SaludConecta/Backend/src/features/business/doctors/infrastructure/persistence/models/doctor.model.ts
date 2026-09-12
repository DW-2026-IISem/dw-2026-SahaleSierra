import { Table, Column, Model, DataType, Default } from 'sequelize-typescript';

@Table({ tableName: 'doctors', timestamps: true, underscored: true })
export class DoctorModel extends Model {
  @Column({ type: DataType.STRING(150), allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare description?: string;

  @Default('ACTIVE')
  @Column({ type: DataType.STRING(20), allowNull: false, field: 'is_active' })
  declare status: string;
}
