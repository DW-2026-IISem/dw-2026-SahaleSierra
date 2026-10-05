import {
  CreateResourceDto,
  PatchResourceDto,
  ResourceResponseDto,
  UpdateResourceDto,
  toResourceResponse,
} from "./dto";
import { ResourcesRepository } from "./resources.repository";
import { Resource } from "./resource.model";
import { AppError } from "../../../shared/errors/app-error";

/**
 * Capa Service del feature Resources.
 *
 * Reglas de negocio: la tupla `(method, path)` es única. Se comprueba antes de
 * escribir para responder 409 con un mensaje útil en lugar de dejar reventar la
 * restricción única de la base de datos como 500.
 */
export class ResourcesService {
  public constructor(
    private readonly repository: ResourcesRepository = new ResourcesRepository(),
  ) {}

  // ================== READ ==================
  public async getAll(): Promise<ResourceResponseDto[]> {
    const resources = await this.repository.findAllActive();
    return resources.map((resource) => toResourceResponse(resource));
  }

  public async getOne(id: number): Promise<ResourceResponseDto> {
    return toResourceResponse(await this.findOrFail(id));
  }

  // ================== CREATE ==================
  public async create(body: CreateResourceDto): Promise<ResourceResponseDto> {
    if (!body.method || !body.path) {
      throw new AppError(400, "method and path are required");
    }
    await this.assertOperationAvailable(body.method, body.path);

    const resource = await this.repository.create({
      method: body.method,
      path: body.path,
      description: body.description ?? null,
      status: body.status ?? "active",
    });
    return toResourceResponse(resource);
  }

  // ================== UPDATE ==================
  public async updatePut(id: number, body: UpdateResourceDto): Promise<ResourceResponseDto> {
    const resource = await this.findOrFail(id);
    await this.assertOperationAvailable(body.method, body.path, id);

    await this.repository.update(resource, {
      method: body.method,
      path: body.path,
      description: body.description ?? null,
    });
    return toResourceResponse(resource);
  }

  public async updatePatch(id: number, body: PatchResourceDto): Promise<ResourceResponseDto> {
    const resource = await this.findOrFail(id);

    const method = body.method ?? resource.method;
    const path = body.path ?? resource.path;
    await this.assertOperationAvailable(method, path, id);

    await this.repository.update(resource, body);
    return toResourceResponse(resource);
  }

  // ================== DELETE ==================
  /** Eliminación física. */
  public async deletePhysical(id: number): Promise<void> {
    const resource = await this.findOrFail(id, false);
    await this.repository.delete(resource);
  }

  /** Eliminación lógica -> `status = inactive`. Deshabilita el punto de acceso. */
  public async deleteLogical(id: number): Promise<ResourceResponseDto> {
    const resource = await this.findOrFail(id);
    await this.repository.update(resource, { status: "inactive" });
    return toResourceResponse(resource);
  }

  // ================== HELPERS ==================
  private async findOrFail(id: number, onlyActive = true): Promise<Resource> {
    const resource = await this.repository.findById(id);
    if (!resource || (onlyActive && resource.status !== "active")) {
      throw new AppError(404, "Resource not found");
    }
    return resource;
  }

  /** 409 si otro recurso ya declara el mismo `(method, path)`. */
  private async assertOperationAvailable(
    method: string,
    path: string,
    excludeId?: number,
  ): Promise<void> {
    const existing = await this.repository.findByOperation(method, path);
    if (existing && existing.id !== excludeId) {
      throw new AppError(409, `Resource ${method.toUpperCase()} ${path} already exists`);
    }
  }
}
