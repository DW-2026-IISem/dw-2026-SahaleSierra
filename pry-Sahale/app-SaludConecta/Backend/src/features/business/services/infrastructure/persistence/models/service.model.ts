import { Table, Column, Model, DataType, Default, Unique } from 'sequelize-typescript';

@Table({ tableName: 'services', timestamps: true, underscored: true })
export class ServiceModel extends Model {
  @Unique
  @Column({ type: DataType.STRING(150), allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare description?: string;

  @Default('ACTIVE')
  @Column({ type: DataType.STRING(20), allowNull: false, field: 'is_active' })
  declare status: string;
}
