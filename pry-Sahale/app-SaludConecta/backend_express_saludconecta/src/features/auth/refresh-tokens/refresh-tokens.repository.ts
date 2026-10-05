import { CreationAttributes, Op, Transaction } from "sequelize";
import { RefreshToken } from "./refresh-token.model";

/**
 * Capa Repository del feature RefreshTokens (tabla `refresh_tokens`).
 *
 * Única que habla con Sequelize. Las consultas que participan en la rotación
 * aceptan transacción y, cuando corresponde, bloquean la fila (`FOR UPDATE`)
 * para que dos peticiones de refresh simultáneas no emitan dos tokens válidos.
 */
export class RefreshTokensRepository {
  /**
   * Busca por hash del token.
   *
   * `lock: true` añade `FOR UPDATE` dentro de la transacción: es lo que hace que
   * la rotación sea segura bajo concurrencia (solo una petición gana).
   */
  public async findByHash(
    tokenHash: string,
    transaction?: Transaction,
    lock = false,
  ): Promise<RefreshToken | null> {
    return RefreshToken.findOne({
      where: { token_hash: tokenHash },
      transaction,
      ...(lock ? { lock: transaction?.LOCK.UPDATE } : {}),
    });
  }

  /** Sesiones de un usuario (activas o todas según `onlyActive`). */
  public async findAllByUser(userId: number, onlyActive = true): Promise<RefreshToken[]> {
    const where: Record<string, unknown> = { user_id: userId };
    if (onlyActive) where.status = "active";

    return RefreshToken.findAll({ where, order: [["createdAt", "DESC"]] });
  }

  /** Una sesión por PK (o `null`). */
  public async findById(id: number): Promise<RefreshToken | null> {
    return RefreshToken.findByPk(id);
  }

  /** Inserta un refresh token (alta de sesión o rotación). */
  public async create(
    data: CreationAttributes<RefreshToken>,
    transaction?: Transaction,
  ): Promise<RefreshToken> {
    return RefreshToken.create(data, { transaction });
  }

  /** Persiste cambios sobre una instancia existente. */
  public async update(
    token: RefreshToken,
    data: Partial<RefreshToken>,
    transaction?: Transaction,
  ): Promise<RefreshToken> {
    return token.update(data, { transaction });
  }

  /**
   * Revoca **toda la familia** de rotación.
   *
   * Se ejecuta al detectar reutilización de un token ya rotado: si un atacante
   * tiene una copia del token anterior, la sesión legítima se invalida por
   * completo y el usuario debe autenticarse de nuevo (Owasp/OAuth2: reuse
   * detection con revocación de familia).
   */
  public async revokeFamily(familyId: string, transaction?: Transaction): Promise<number> {
    const [updated] = await RefreshToken.update(
      { status: "inactive" },
      { where: { family_id: familyId, status: "active" }, transaction },
    );
    return updated;
  }

  /** Revoca todas las sesiones activas de un usuario (cierre de sesión global). */
  public async revokeAllByUser(userId: number): Promise<number> {
    const [updated] = await RefreshToken.update(
      { status: "inactive" },
      { where: { user_id: userId, status: "active" } },
    );
    return updated;
  }

  /** Elimina físicamente las sesiones ya expiradas o revocadas de un usuario. */
  public async purgeInactiveByUser(userId: number): Promise<number> {
    return RefreshToken.destroy({
      where: {
        user_id: userId,
        [Op.or]: [{ status: "inactive" }, { expires_at: { [Op.lt]: new Date() } }],
      },
    });
  }

  /** Cuenta las sesiones activas de un usuario. */
  public async countActiveByUser(userId: number): Promise<number> {
    return RefreshToken.count({ where: { user_id: userId, status: "active" } });
  }
}
