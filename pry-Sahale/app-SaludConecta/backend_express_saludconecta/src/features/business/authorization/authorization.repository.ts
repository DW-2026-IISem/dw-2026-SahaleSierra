import { CreationAttributes, Transaction } from "sequelize";
import { Authorization, AuthorizationI } from "./authorization.model";

/**
 * Capa Repository del feature Authorization (tabla `authorizations`).
 *
 * Única que habla con Sequelize. No contiene reglas de negocio.
 */
export class AuthorizationRepository {
  /** Autorizaciones activas. */
  public async findAllActive(): Promise<Authorization[]> {
    return Authorization.findAll({ where: { status: "active" } });
  }

  /** Una autorización por PK (o `null`), sin filtrar por estado. */
  public async findById(id: number, transaction?: Transaction): Promise<Authorization | null> {
    return Authorization.findByPk(id, { transaction });
  }

  /** La autorización de una cita (0..1:1), activa o no, o `null`. */
  public async findByAppointmentId(
    appointment_id: number,
    transaction?: Transaction
  ): Promise<Authorization | null> {
    return Authorization.findOne({ where: { appointment_id }, transaction });
  }

  public async create(
    data: CreationAttributes<Authorization>,
    transaction?: Transaction
  ): Promise<Authorization> {
    return Authorization.create(data, { transaction });
  }

  public async update(
    authorization: Authorization,
    data: Partial<AuthorizationI>,
    transaction?: Transaction
  ): Promise<Authorization> {
    return authorization.update(data, { transaction });
  }

  public async delete(authorization: Authorization, transaction?: Transaction): Promise<void> {
    await authorization.destroy({ transaction });
  }
}
