import { CreationAttributes, Transaction } from "sequelize";
import { Doctor, DoctorI } from "./doctor.model";

/**
 * Capa Repository del feature Doctor.
 *
 * Única que habla con Sequelize (el modelo `Doctor`). No contiene reglas de
 * negocio ni conoce `req`/`res`.
 */
export class DoctorRepository {
  /** Registros activos. */
  public async findAllActive(): Promise<Doctor[]> {
    return Doctor.findAll({ where: { status: "active" } });
  }

  /** Un registro por PK (o `null`), sin filtrar por estado. */
  public async findById(id: number, transaction?: Transaction): Promise<Doctor | null> {
    return Doctor.findByPk(id, { transaction });
  }

  public async create(
    data: CreationAttributes<Doctor>,
    transaction?: Transaction
  ): Promise<Doctor> {
    return Doctor.create(data, { transaction });
  }

  public async update(
    doctor: Doctor,
    data: Partial<DoctorI>,
    transaction?: Transaction
  ): Promise<Doctor> {
    return doctor.update(data, { transaction });
  }

  public async delete(doctor: Doctor, transaction?: Transaction): Promise<void> {
    await doctor.destroy({ transaction });
  }
}
