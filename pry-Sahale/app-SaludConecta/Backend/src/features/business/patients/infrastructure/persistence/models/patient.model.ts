import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  Unique,
} from 'sequelize-typescript';

@Table({ tableName: 'patients', timestamps: true, underscored: true })
export class PatientModel extends Model {
  @Column({ type: DataType.STRING(10), allowNull: false, field: 'document_type' })
  declare documentType: string;

  @Unique
  @Column({ type: DataType.STRING(20), allowNull: false, field: 'document_number' })
  declare documentNumber: string;

  @Column({ type: DataType.STRING(150), allowNull: false })
  declare name: string;

  @Column({ type: DataType.DATEONLY, allowNull: false, field: 'birth_date' })
  declare birthDate: Date;

  @Column({ type: DataType.STRING(150), allowNull: true })
  declare contact?: string;

  @Default('ACTIVE')
  @Column({ type: DataType.STRING(20), allowNull: false, field: 'is_active' })
  declare status: string;
}
