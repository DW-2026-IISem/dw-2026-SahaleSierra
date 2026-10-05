import { CreationAttributes, Transaction } from "sequelize";
import { DoctorSpecialty, DoctorSpecialtyI } from "./doctor-specialty.model";

/**
 * Capa Repository del feature DoctorSpecialty (tabla `doctor_specialties`).
 *
 * Única que habla con Sequelize. No contiene reglas de negocio.
 */
export class DoctorSpecialtyRepository {
  /** Relaciones activas. */
  public async findAllActive(): Promise<DoctorSpecialty[]> {
    return DoctorSpecialty.findAll({ where: { status: "active" } });
  }

  /** Una relación por PK (o `null`), sin filtrar por estado. */
  public async findById(id: number, transaction?: Transaction): Promise<DoctorSpecialty | null> {
    return DoctorSpecialty.findByPk(id, { transaction });
  }

  /** La relación de un par médico-especialidad (activa o no), o `null`. */
  public async findByPair(
    doctor_id: number,
    specialty_id: number,
    transaction?: Transaction
  ): Promise<DoctorSpecialty | null> {
    return DoctorSpecialty.findOne({ where: { doctor_id, specialty_id }, transaction });
  }

  public async create(
    data: CreationAttributes<DoctorSpecialty>,
    transaction?: Transaction
  ): Promise<DoctorSpecialty> {
    return DoctorSpecialty.create(data, { transaction });
  }

  public async update(
    doctorSpecialty: DoctorSpecialty,
    data: Partial<DoctorSpecialtyI>,
    transaction?: Transaction
  ): Promise<DoctorSpecialty> {
    return doctorSpecialty.update(data, { transaction });
  }

  public async delete(doctorSpecialty: DoctorSpecialty, transaction?: Transaction): Promise<void> {
    await doctorSpecialty.destroy({ transaction });
  }
}
