export const createProductTypesTableMigration = {
  name: 'create-product-types-table',
  async up(): Promise<void> {
    // Sequelize sync handles table creation in development.
    // Production: CREATE TABLE product_types (id, name, description, status, createdAt, updatedAt)
  },
  async down(): Promise<void> {
    // Production: DROP TABLE product_types
  },
};
