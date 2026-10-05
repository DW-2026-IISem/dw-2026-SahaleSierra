import { CreationAttributes, Op, Transaction } from "sequelize";
import { Appointment, AppointmentI } from "./appointment.model";
import { Agenda } from "../agenda/agenda.model";
import { Patient } from "../patient/patient.model";

/** `include` reutilizable: agenda y paciente de la cita. */
const RELATIONS = [
  { model: Agenda, as: "agenda" },
  { model: Patient, as: "patient" },
];

/**
 * Capa Repository del feature Appointment (tabla `appointments`).
 *
 * Única que habla con Sequelize. Aquí vive la consulta de **cruce de horario**,
 * que el service usa para no sobre-reservar una agenda.
 */
export class AppointmentRepository {
  /** Citas activas (con agenda y paciente). */
  public async findAllActive(): Promise<Appointment[]> {
    return Appointment.findAll({ where: { status: "active" }, include: RELATIONS });
  }

  /**
   * Una cita por PK (o `null`), sin relaciones y sin filtrar por estado.
   *
   * `lock: true` añade `FOR UPDATE` dentro de la transacción: lo usa el alta de
   * atenciones para que dos peticiones no atiendan la misma cita a la vez.
   */
  public async findById(
    id: number,
    transaction?: Transaction,
    lock = false
  ): Promise<Appointment | null> {
    return Appointment.findByPk(id, {
      transaction,
      lock: lock && transaction ? transaction.LOCK.UPDATE : undefined,
    });
  }

  /** Una cita por PK con agenda y paciente (o `null`). */
  public async findByIdWithRelations(id: number): Promise<Appointment | null> {
    return Appointment.findByPk(id, { include: RELATIONS });
  }

  /**
   * Primera cita activa y no cancelada de la agenda que se cruza con el rango
   * `[start, end)`, o `null`. `excludeId` descarta la propia cita al editar.
   */
  public async findOverlap(
    agenda_id: number,
    start: Date,
    end: Date,
    excludeId: number | null,
    transaction?: Transaction
  ): Promise<Appointment | null> {
    const where: Record<string | symbol, unknown> = {
      agenda_id,
      status: "active",
      state: { [Op.ne]: "cancelled" },
      start_date: { [Op.lt]: end },
      end_date: { [Op.gt]: start },
    };
    if (excludeId !== null) {
      where.id = { [Op.ne]: excludeId };
    }
    return Appointment.findOne({ where, transaction });
  }

  public async create(
    data: CreationAttributes<Appointment>,
    transaction?: Transaction
  ): Promise<Appointment> {
    return Appointment.create(data, { transaction });
  }

  public async update(
    appointment: Appointment,
    data: Partial<AppointmentI>,
    transaction?: Transaction
  ): Promise<Appointment> {
    return appointment.update(data, { transaction });
  }

  public async delete(appointment: Appointment, transaction?: Transaction): Promise<void> {
    await appointment.destroy({ transaction });
  }
}
