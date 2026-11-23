import { CreationAttributes, Op, Transaction } from "sequelize";
import { Resource } from "./resource.model";
import { normalizePath } from "../../../shared/auth/resource-match";

/**
 * Capa Repository del feature Resources.
 * Única que habla con Sequelize (el modelo `Resource`).
 */
export class ResourcesRepository {
  /** Todos los recursos activos. */
  public async findAllActive(): Promise<Resource[]> {
    return Resource.findAll({ where: { status: "active" } });
  }

  /** Un recurso por PK (o `null`). */
  public async findById(id: number, transaction?: Transaction): Promise<Resource | null> {
    return Resource.findByPk(id, { transaction });
  }
  
  /**
   * Varios recursos por PK en una sola consulta (`WHERE id IN (...)`).
   * Los IDs que no existen simplemente no vienen: quien llama compara.
   */
  public async findByIds(ids: number[], transaction?: Transaction): Promise<Resource[]> {
    if (ids.length === 0) {
      return [];
    }
    return Resource.findAll({ where: { id: { [Op.in]: ids } }, transaction });
  }


  /** Un recurso por su par `(method, path)` (o `null`). */
  public async findByOperation(method: string, path: string): Promise<Resource | null> {
    return Resource.findOne({
      where: { method: method.trim().toUpperCase(), path: normalizePath(path.trim()) },
    });
  }

  /** Inserta un recurso. */
  public async create(data: CreationAttributes<Resource>): Promise<Resource> {
    return Resource.create(data);
  }

  /** Persiste cambios sobre una instancia existente. */
  public async update(resource: Resource, data: Partial<Resource>): Promise<Resource> {
    return resource.update(data);
  }

  /** Elimina físicamente una instancia. */
  public async delete(resource: Resource): Promise<void> {
    await resource.destroy();
  }
}
