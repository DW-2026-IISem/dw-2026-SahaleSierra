import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('authorizations', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    appointment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: { model: 'appointments', key: 'id' },
      onDelete: 'CASCADE',
    },
    name: { type: DataTypes.STRING(150), allowNull: false },
    description: { type: DataTypes.STRING(255), allowNull: true },
    is_active: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'ACTIVE' },
    created_at: { type: DataTypes.DATE, allowNull: false },
    updated_at: { type: DataTypes.DATE, allowNull: false },
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('authorizations');
}
