import { Table, Column, Model, DataType, Default, ForeignKey, BelongsTo, Unique } from 'sequelize-typescript';
import { PatientModel } from '../../../../patients/infrastructure/persistence/models/patient.model.js';

@Table({ tableName: 'clinical_records', timestamps: true, underscored: true })
export class ClinicalRecordModel extends Model {
  @Unique
  @ForeignKey(() => PatientModel)
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'patient_id' })
  declare patientId: number;

  @BelongsTo(() => PatientModel)
  declare patient: PatientModel;

  @Column({ type: DataType.STRING(150), allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare description?: string;

  @Default('ACTIVE')
  @Column({ type: DataType.STRING(20), allowNull: false, field: 'is_active' })
  declare status: string;
}
