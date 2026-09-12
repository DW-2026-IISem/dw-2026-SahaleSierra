import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.addColumn('encounters', 'invoice_id', {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'invoices', key: 'id' },
    onDelete: 'SET NULL',
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.removeColumn('encounters', 'invoice_id');
}
