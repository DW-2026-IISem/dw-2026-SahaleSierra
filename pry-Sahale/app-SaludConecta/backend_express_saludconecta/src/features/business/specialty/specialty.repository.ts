import { CreationAttributes, Transaction } from "sequelize";
import { Specialty, SpecialtyI } from "./specialty.model";

/**
 * Capa Repository del feature Specialty.
 *
 * Única que habla con Sequelize (el modelo `Specialty`). No contiene reglas de
 * negocio ni conoce `req`/`res`.
 */
export class SpecialtyRepository {
  /** Registros activos. */
  public async findAllActive(): Promise<Specialty[]> {
    return Specialty.findAll({ where: { status: "active" } });
  }

  /** Un registro por PK (o `null`), sin filtrar por estado. */
  public async findById(id: number, transaction?: Transaction): Promise<Specialty | null> {
    return Specialty.findByPk(id, { transaction });
  }

  public async create(
    data: CreationAttributes<Specialty>,
    transaction?: Transaction
  ): Promise<Specialty> {
    return Specialty.create(data, { transaction });
  }

  public async update(
    specialty: Specialty,
    data: Partial<SpecialtyI>,
    transaction?: Transaction
  ): Promise<Specialty> {
    return specialty.update(data, { transaction });
  }

  public async delete(specialty: Specialty, transaction?: Transaction): Promise<void> {
    await specialty.destroy({ transaction });
  }
}
