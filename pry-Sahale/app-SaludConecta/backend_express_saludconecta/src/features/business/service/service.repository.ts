import { CreationAttributes, Transaction } from "sequelize";
import { Service, ServiceI } from "./service.model";

/**
 * Capa Repository del feature Service.
 *
 * Única que habla con Sequelize (el modelo `Service`). No contiene reglas de
 * negocio ni conoce `req`/`res`.
 */
export class ServiceRepository {
  /** Registros activos. */
  public async findAllActive(): Promise<Service[]> {
    return Service.findAll({ where: { status: "active" } });
  }

  /** Un registro por PK (o `null`), sin filtrar por estado. */
  public async findById(id: number, transaction?: Transaction): Promise<Service | null> {
    return Service.findByPk(id, { transaction });
  }

  public async create(
    data: CreationAttributes<Service>,
    transaction?: Transaction
  ): Promise<Service> {
    return Service.create(data, { transaction });
  }

  public async update(
    service: Service,
    data: Partial<ServiceI>,
    transaction?: Transaction
  ): Promise<Service> {
    return service.update(data, { transaction });
  }

  public async delete(service: Service, transaction?: Transaction): Promise<void> {
    await service.destroy({ transaction });
  }
}
