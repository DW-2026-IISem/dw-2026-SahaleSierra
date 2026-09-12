import { Table, Column, Model, DataType, Default, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { PatientModel } from '../../../../patients/infrastructure/persistence/models/patient.model.js';
import { AgendaModel } from '../../../../agendas/infrastructure/persistence/models/agenda.model.js';
import { AppointmentStatus } from '../../../domain/enums/appointment-status.enum.js';

@Table({ tableName: 'appointments', timestamps: true, underscored: true })
export class AppointmentModel extends Model {
  @ForeignKey(() => PatientModel)
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'patient_id' })
  declare patientId: number;

  @BelongsTo(() => PatientModel)
  declare patient: PatientModel;

  @ForeignKey(() => AgendaModel)
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'agenda_id' })
  declare agendaId: number;

  @BelongsTo(() => AgendaModel)
  declare agenda: AgendaModel;

  @Column({ type: DataType.DATE, allowNull: false, field: 'fecha_inicio' })
  declare startDate: Date;

  @Column({ type: DataType.DATE, allowNull: false, field: 'fecha_fin' })
  declare endDate: Date;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare reason: string;

  @Default(AppointmentStatus.SCHEDULED)
  @Column({ type: DataType.STRING(20), allowNull: false })
  declare status: string;
}
