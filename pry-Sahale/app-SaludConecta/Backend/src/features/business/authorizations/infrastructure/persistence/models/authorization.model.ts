import { Table, Column, Model, DataType, Default, ForeignKey, BelongsTo, Unique } from 'sequelize-typescript';
import { AppointmentModel } from '../../../../appointments/infrastructure/persistence/models/appointment.model.js';

@Table({ tableName: 'authorizations', timestamps: true, underscored: true })
export class AuthorizationModel extends Model {
  @Unique
  @ForeignKey(() => AppointmentModel)
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'appointment_id' })
  declare appointmentId: number;

  @BelongsTo(() => AppointmentModel)
  declare appointment: AppointmentModel;

  @Column({ type: DataType.STRING(150), allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare description?: string;

  @Default('ACTIVE')
  @Column({ type: DataType.STRING(20), allowNull: false, field: 'is_active' })
  declare status: string;
}
