import { CreationAttributes, Transaction } from "sequelize";
import { Patient, PatientI } from "./patient.model";

/**
 * Capa Repository del feature Patient.
 *
 * Única que habla con Sequelize (el modelo `Patient`). No contiene reglas de
 * negocio ni conoce `req`/`res`. Los métodos aceptan una transacción opcional
 * para que los services transaccionales de otros features puedan reutilizarlos.
 */
export class PatientRepository {
  /** Todos los pacientes activos. */
  public async findAllActive(): Promise<Patient[]> {
    return Patient.findAll({ where: { status: "active" } });
  }

  /** Un paciente por PK (o `null`), sin filtrar por estado. */
  public async findById(id: number, transaction?: Transaction): Promise<Patient | null> {
    return Patient.findByPk(id, { transaction });
  }

  public async create(
    data: CreationAttributes<Patient>,
    transaction?: Transaction
  ): Promise<Patient> {
    return Patient.create(data, { transaction });
  }

  public async update(
    patient: Patient,
    data: Partial<PatientI>,
    transaction?: Transaction
  ): Promise<Patient> {
    return patient.update(data, { transaction });
  }

  public async delete(patient: Patient, transaction?: Transaction): Promise<void> {
    await patient.destroy({ transaction });
  }
}
