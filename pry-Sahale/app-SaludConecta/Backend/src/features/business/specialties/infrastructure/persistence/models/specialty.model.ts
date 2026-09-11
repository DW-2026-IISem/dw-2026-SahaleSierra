import { Table, Column, Model, DataType, Default, Unique } from 'sequelize-typescript';

@Table({ tableName: 'specialties', timestamps: true, underscored: true })
export class SpecialtyModel extends Model {
  @Unique
  @Column({ type: DataType.STRING(100), allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare description?: string;

  @Default('ACTIVE')
  @Column({ type: DataType.STRING(20), allowNull: false, field: 'is_active' })
  declare status: string;
}
