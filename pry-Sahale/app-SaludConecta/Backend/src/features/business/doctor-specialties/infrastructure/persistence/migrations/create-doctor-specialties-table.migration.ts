import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('doctor_specialties', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    principal_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'doctors', key: 'id' },
      onDelete: 'CASCADE',
    },
    relacionado_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'specialties', key: 'id' },
      onDelete: 'CASCADE',
    },
    datos_relacion: { type: DataTypes.STRING(255), allowNull: true },
    is_active: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'ACTIVE' },
    created_at: { type: DataTypes.DATE, allowNull: false },
    updated_at: { type: DataTypes.DATE, allowNull: false },
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('doctor_specialties');
}
