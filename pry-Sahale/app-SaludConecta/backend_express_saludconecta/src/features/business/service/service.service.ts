import {
  CreateServiceDto,
  PatchServiceDto,
  ServiceResponseDto,
  UpdateServiceDto,
  toServiceResponse,
} from "./dto";
import { ServiceRepository } from "./service.repository";
import { Service, ServiceI } from "./service.model";
import { AppError } from "../../../shared/errors/app-error";

/**
 * Capa Service del feature Service.
 *
 * Reglas de negocio: default de `status` al crear, conservación del estado en
 * PUT y política de borrado lógico. No conoce `req`/`res` ni escribe Sequelize
 * directamente: los errores de negocio se lanzan como `AppError`.
 */
export class ServiceService {
  public constructor(
    private readonly repository: ServiceRepository = new ServiceRepository()
  ) {}

  // ================== READ ==================
  public async getAll(): Promise<ServiceResponseDto[]> {
    const services = await this.repository.findAllActive();
    return services.map((service) => toServiceResponse(service));
  }

  public async getOne(id: number): Promise<ServiceResponseDto> {
    return toServiceResponse(await this.findOrFail(id));
  }

  // ================== CREATE ==================
  public async create(body: CreateServiceDto): Promise<ServiceResponseDto> {
    const service = await this.repository.create({
      name: body.name,
      description: body.description ?? null,
      status: body.status ?? "active",
    });
    return toServiceResponse(service);
  }

  // ================== UPDATE ==================
  public async updatePut(id: number, body: UpdateServiceDto): Promise<ServiceResponseDto> {
    const service = await this.findOrFail(id);

    await this.repository.update(service, {
      name: body.name,
      description: body.description ?? null,
      status: body.status ?? service.status,
    });

    return toServiceResponse(service);
  }

  public async updatePatch(id: number, body: PatchServiceDto): Promise<ServiceResponseDto> {
    const service = await this.findOrFail(id);

    const changes: Partial<ServiceI> = {};
    if (body.name !== undefined) changes.name = body.name;
    if (body.description !== undefined) changes.description = body.description;
    if (body.status !== undefined) changes.status = body.status;

    await this.repository.update(service, changes);
    return toServiceResponse(service);
  }

  // ================== DELETE ==================
  /** Eliminación física */
  public async deletePhysical(id: number): Promise<void> {
    const service = await this.findOrFail(id);
    await this.repository.delete(service);
  }

  /** Eliminación lógica → status = inactive */
  public async deleteLogical(id: number): Promise<ServiceResponseDto> {
    const service = await this.findOrFail(id);
    await this.repository.update(service, { status: "inactive" });
    return toServiceResponse(service);
  }

  // ================== HELPERS ==================
  /** Devuelve el registro o lanza 404 (no filtra por estado, igual que en Fase I). */
  private async findOrFail(id: number): Promise<Service> {
    const service = await this.repository.findById(id);
    if (!service) {
      throw new AppError(404, "Service not found");
    }
    return service;
  }
}
