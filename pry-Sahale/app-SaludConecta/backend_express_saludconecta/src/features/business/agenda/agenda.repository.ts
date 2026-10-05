import { CreationAttributes, Transaction } from "sequelize";
import { Agenda, AgendaI } from "./agenda.model";

/**
 * Capa Repository del feature Agenda.
 *
 * Única que habla con Sequelize (el modelo `Agenda`). No contiene reglas de
 * negocio ni conoce `req`/`res`.
 */
export class AgendaRepository {
  /** Agendas activas. */
  public async findAllActive(): Promise<Agenda[]> {
    return Agenda.findAll({ where: { status: "active" } });
  }

  /**
   * Una agenda por PK (o `null`), sin filtrar por estado.
   *
   * `lock: true` añade `FOR UPDATE` dentro de la transacción: lo usa el alta
   * de citas para que dos reservas simultáneas de la misma agenda no se crucen.
   */
  public async findById(
    id: number,
    transaction?: Transaction,
    lock = false
  ): Promise<Agenda | null> {
    return Agenda.findByPk(id, {
      transaction,
      lock: lock && transaction ? transaction.LOCK.UPDATE : undefined,
    });
  }

  public async create(
    data: CreationAttributes<Agenda>,
    transaction?: Transaction
  ): Promise<Agenda> {
    return Agenda.create(data, { transaction });
  }

  public async update(
    agenda: Agenda,
    data: Partial<AgendaI>,
    transaction?: Transaction
  ): Promise<Agenda> {
    return agenda.update(data, { transaction });
  }

  public async delete(agenda: Agenda, transaction?: Transaction): Promise<void> {
    await agenda.destroy({ transaction });
  }
}
