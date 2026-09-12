import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('encounters', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    referencia_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: { model: 'appointments', key: 'id' },
      onDelete: 'CASCADE',
    },
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'services', key: 'id' },
      onDelete: 'RESTRICT',
    },
    clinical_record_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'clinical_records', key: 'id' },
      onDelete: 'RESTRICT',
    },
    fecha_inicio: { type: DataTypes.DATE, allowNull: false },
    fecha_fin: { type: DataTypes.DATE, allowNull: false },
    total: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    observations: { type: DataTypes.STRING(500), allowNull: true },
    status: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'REGISTRADA' },
    created_at: { type: DataTypes.DATE, allowNull: false },
    updated_at: { type: DataTypes.DATE, allowNull: false },
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('encounters');
}
