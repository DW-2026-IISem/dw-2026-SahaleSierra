export const createProductsTableMigration = {
  name: 'create-products-table',
  async up(): Promise<void> {
    // Sequelize sync handles table creation in development.
    // Production: CREATE TABLE products (id, name, brand, price, minStock, quantity, productTypeId, status, createdAt, updatedAt)
  },
  async down(): Promise<void> {
    // Production: DROP TABLE products
  },
};
