import { CreationAttributes, Transaction } from "sequelize";
import { ClinicalRecord, ClinicalRecordI } from "./clinical-record.model";

/**
 * Capa Repository del feature ClinicalRecord (tabla `clinical_records`).
 *
 * Única que habla con Sequelize. No contiene reglas de negocio.
 */
export class ClinicalRecordRepository {
  /** Historias activas. */
  public async findAllActive(): Promise<ClinicalRecord[]> {
    return ClinicalRecord.findAll({ where: { status: "active" } });
  }

  /** Una historia por PK (o `null`), sin filtrar por estado. */
  public async findById(id: number, transaction?: Transaction): Promise<ClinicalRecord | null> {
    return ClinicalRecord.findByPk(id, { transaction });
  }

  /** La historia de un paciente (1:1), activa o no, o `null`. */
  public async findByPatientId(
    patient_id: number,
    transaction?: Transaction
  ): Promise<ClinicalRecord | null> {
    return ClinicalRecord.findOne({ where: { patient_id }, transaction });
  }

  public async create(
    data: CreationAttributes<ClinicalRecord>,
    transaction?: Transaction
  ): Promise<ClinicalRecord> {
    return ClinicalRecord.create(data, { transaction });
  }

  public async update(
    clinicalRecord: ClinicalRecord,
    data: Partial<ClinicalRecordI>,
    transaction?: Transaction
  ): Promise<ClinicalRecord> {
    return clinicalRecord.update(data, { transaction });
  }

  public async delete(clinicalRecord: ClinicalRecord, transaction?: Transaction): Promise<void> {
    await clinicalRecord.destroy({ transaction });
  }
}
