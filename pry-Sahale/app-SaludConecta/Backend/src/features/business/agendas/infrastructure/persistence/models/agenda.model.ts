import { Table, Column, Model, DataType, Default, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { DoctorModel } from '../../../../doctors/infrastructure/persistence/models/doctor.model.js';

@Table({ tableName: 'agendas', timestamps: true, underscored: true })
export class AgendaModel extends Model {
  @ForeignKey(() => DoctorModel)
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'doctor_id' })
  declare doctorId: number;

  @BelongsTo(() => DoctorModel)
  declare doctor: DoctorModel;

  @Column({ type: DataType.STRING(150), allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare description?: string;

  @Default('ACTIVE')
  @Column({ type: DataType.STRING(20), allowNull: false, field: 'is_active' })
  declare status: string;
}
