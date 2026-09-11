import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('patients', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    document_type: { type: DataTypes.STRING(10), allowNull: false },
    document_number: { type: DataTypes.STRING(20), allowNull: false, unique: true },
    name: { type: DataTypes.STRING(150), allowNull: false },
    birth_date: { type: DataTypes.DATEONLY, allowNull: false },
    contact: { type: DataTypes.STRING(150), allowNull: true },
    is_active: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'ACTIVE' },
    created_at: { type: DataTypes.DATE, allowNull: false },
    updated_at: { type: DataTypes.DATE, allowNull: false },
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('patients');
}
