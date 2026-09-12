import { Table, Column, Model, DataType, Default, ForeignKey, BelongsTo, Unique } from 'sequelize-typescript';
import { AppointmentModel } from '../../../../appointments/infrastructure/persistence/models/appointment.model.js';
import { ServiceModel } from '../../../../services/infrastructure/persistence/models/service.model.js';
import { ClinicalRecordModel } from '../../../../clinical-records/infrastructure/persistence/models/clinical-record.model.js';
import { EncounterStatus } from '../../../domain/enums/encounter-status.enum.js';

@Table({ tableName: 'encounters', timestamps: true, underscored: true })
export class EncounterModel extends Model {
  @Unique
  @ForeignKey(() => AppointmentModel)
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'referencia_id' })
  declare appointmentId: number;

  @BelongsTo(() => AppointmentModel)
  declare appointment: AppointmentModel;

  @ForeignKey(() => ServiceModel)
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'service_id' })
  declare serviceId: number;

  @BelongsTo(() => ServiceModel)
  declare service: ServiceModel;

  @ForeignKey(() => ClinicalRecordModel)
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'clinical_record_id' })
  declare clinicalRecordId: number;

  @BelongsTo(() => ClinicalRecordModel)
  declare clinicalRecord: ClinicalRecordModel;

  @Column({ type: DataType.DATE, allowNull: false, field: 'fecha_inicio' })
  declare startDate: Date;

  @Column({ type: DataType.DATE, allowNull: false, field: 'fecha_fin' })
  declare endDate: Date;

  @Column({ type: DataType.DECIMAL(12, 2), allowNull: false })
  declare total: number;

  @Column({ type: DataType.STRING(500), allowNull: true })
  declare observations?: string;

  @Default(EncounterStatus.REGISTERED)
  @Column({ type: DataType.STRING(20), allowNull: false })
  declare status: string;
}
// NOTA: agregar dentro de la clase EncounterModel (Fase 16), junto a los demás @ForeignKey:
//
// @ForeignKey(() => InvoiceModel)
// @Column({ type: DataType.INTEGER, allowNull: true, field: 'invoice_id' })
// declare invoiceId?: number;
//
// @BelongsTo(() => InvoiceModel)
// declare invoice?: InvoiceModel;
//
// import { InvoiceModel } from '../../../../invoices/infrastructure/persistence/models/invoice.model.js';
