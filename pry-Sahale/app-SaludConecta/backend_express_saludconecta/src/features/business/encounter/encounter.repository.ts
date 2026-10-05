import { CreationAttributes, Transaction } from "sequelize";
import { Encounter, EncounterI } from "./encounter.model";
import { Appointment } from "../appointment/appointment.model";
import { ClinicalRecord } from "../clinical-record/clinical-record.model";
import { Service } from "../service/service.model";

/** `include` reutilizable: cita, historia clínica y servicio de la atención. */
const RELATIONS = [
  { model: Appointment, as: "appointment" },
  { model: ClinicalRecord, as: "clinical_record" },
  { model: Service, as: "service" },
];

/**
 * Capa Repository del feature Encounter (tabla `encounters`).
 *
 * Única que habla con Sequelize. Incluye las dos escrituras masivas que usa la
 * facturación: asociar atenciones a una factura y liberarlas.
 */
export class EncounterRepository {
  /** Atenciones activas (con cita, historia y servicio). */
  public async findAllActive(): Promise<Encounter[]> {
    return Encounter.findAll({ where: { status: "active" }, include: RELATIONS });
  }

  /**
   * Una atención por PK (o `null`), sin relaciones y sin filtrar por estado.
   * `lock: true` añade `FOR UPDATE` dentro de la transacción (facturación).
   */
  public async findById(
    id: number,
    transaction?: Transaction,
    lock = false
  ): Promise<Encounter | null> {
    return Encounter.findByPk(id, {
      transaction,
      lock: lock && transaction ? transaction.LOCK.UPDATE : undefined,
    });
  }

  /** Una atención por PK con cita, historia y servicio (o `null`). */
  public async findByIdWithRelations(id: number): Promise<Encounter | null> {
    return Encounter.findByPk(id, { include: RELATIONS });
  }

  /** La atención de una cita (0..1:1), o `null`. */
  public async findByAppointmentId(
    appointment_id: number,
    transaction?: Transaction
  ): Promise<Encounter | null> {
    return Encounter.findOne({ where: { appointment_id }, transaction });
  }

  public async create(
    data: CreationAttributes<Encounter>,
    transaction?: Transaction
  ): Promise<Encounter> {
    return Encounter.create(data, { transaction });
  }

  public async update(
    encounter: Encounter,
    data: Partial<EncounterI>,
    transaction?: Transaction
  ): Promise<Encounter> {
    return encounter.update(data, { transaction });
  }

  public async delete(encounter: Encounter, transaction?: Transaction): Promise<void> {
    await encounter.destroy({ transaction });
  }

  /** Asocia las atenciones indicadas a una factura. */
  public async assignInvoice(
    ids: number[],
    invoice_id: number,
    transaction?: Transaction
  ): Promise<void> {
    await Encounter.update({ invoice_id }, { where: { id: ids }, transaction });
  }

  /** Libera todas las atenciones de una factura (`invoice_id = null`). */
  public async releaseInvoice(invoice_id: number, transaction?: Transaction): Promise<void> {
    await Encounter.update({ invoice_id: null }, { where: { invoice_id }, transaction });
  }
}
