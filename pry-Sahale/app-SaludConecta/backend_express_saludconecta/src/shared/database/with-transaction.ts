import { Transaction } from "sequelize";
import { sequelize } from "../../database/db";

export async function withTransaction<T>(
  work: (t: Transaction) => Promise<T>
): Promise<T> {
  return sequelize.transaction(work);
}
