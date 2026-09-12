import { Table, Column, Model, DataType, Default, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { DoctorModel } from '../../../../doctors/infrastructure/persistence/models/doctor.model.js';
import { SpecialtyModel } from '../../../../specialties/infrastructure/persistence/models/specialty.model.js';

@Table({ tableName: 'doctor_specialties', timestamps: true, underscored: true })
export class DoctorSpecialtyModel extends Model {
  @ForeignKey(() => DoctorModel)
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'principal_id' })
  declare doctorId: number;

  @BelongsTo(() => DoctorModel)
  declare doctor: DoctorModel;

  @ForeignKey(() => SpecialtyModel)
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'relacionado_id' })
  declare specialtyId: number;

  @BelongsTo(() => SpecialtyModel)
  declare specialty: SpecialtyModel;

  @Column({ type: DataType.STRING(255), allowNull: true, field: 'datos_relacion' })
  declare relationData?: string;

  @Default('ACTIVE')
  @Column({ type: DataType.STRING(20), allowNull: false, field: 'is_active' })
  declare status: string;
}
