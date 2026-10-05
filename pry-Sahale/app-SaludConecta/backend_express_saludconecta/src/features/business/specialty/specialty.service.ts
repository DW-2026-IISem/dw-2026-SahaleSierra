import {
  CreateSpecialtyDto,
  PatchSpecialtyDto,
  SpecialtyResponseDto,
  UpdateSpecialtyDto,
  toSpecialtyResponse,
} from "./dto";
import { SpecialtyRepository } from "./specialty.repository";
import { Specialty, SpecialtyI } from "./specialty.model";
import { AppError } from "../../../shared/errors/app-error";

/**
 * Capa Service del feature Specialty.
 *
 * Reglas de negocio: default de `status` al crear, conservación del estado en
 * PUT y política de borrado lógico. No conoce `req`/`res` ni escribe Sequelize
 * directamente: los errores de negocio se lanzan como `AppError`.
 */
export class SpecialtyService {
  public constructor(
    private readonly repository: SpecialtyRepository = new SpecialtyRepository()
  ) {}

  // ================== READ ==================
  public async getAll(): Promise<SpecialtyResponseDto[]> {
    const specialties = await this.repository.findAllActive();
    return specialties.map((specialty) => toSpecialtyResponse(specialty));
  }

  public async getOne(id: number): Promise<SpecialtyResponseDto> {
    return toSpecialtyResponse(await this.findOrFail(id));
  }

  // ================== CREATE ==================
  public async create(body: CreateSpecialtyDto): Promise<SpecialtyResponseDto> {
    const specialty = await this.repository.create({
      name: body.name,
      description: body.description ?? null,
      status: body.status ?? "active",
    });
    return toSpecialtyResponse(specialty);
  }

  // ================== UPDATE ==================
  public async updatePut(id: number, body: UpdateSpecialtyDto): Promise<SpecialtyResponseDto> {
    const specialty = await this.findOrFail(id);

    await this.repository.update(specialty, {
      name: body.name,
      description: body.description ?? null,
      status: body.status ?? specialty.status,
    });

    return toSpecialtyResponse(specialty);
  }

  public async updatePatch(id: number, body: PatchSpecialtyDto): Promise<SpecialtyResponseDto> {
    const specialty = await this.findOrFail(id);

    const changes: Partial<SpecialtyI> = {};
    if (body.name !== undefined) changes.name = body.name;
    if (body.description !== undefined) changes.description = body.description;
    if (body.status !== undefined) changes.status = body.status;

    await this.repository.update(specialty, changes);
    return toSpecialtyResponse(specialty);
  }

  // ================== DELETE ==================
  /** Eliminación física */
  public async deletePhysical(id: number): Promise<void> {
    const specialty = await this.findOrFail(id);
    await this.repository.delete(specialty);
  }

  /** Eliminación lógica → status = inactive */
  public async deleteLogical(id: number): Promise<SpecialtyResponseDto> {
    const specialty = await this.findOrFail(id);
    await this.repository.update(specialty, { status: "inactive" });
    return toSpecialtyResponse(specialty);
  }

  // ================== HELPERS ==================
  /** Devuelve el registro o lanza 404 (no filtra por estado, igual que en Fase I). */
  private async findOrFail(id: number): Promise<Specialty> {
    const specialty = await this.repository.findById(id);
    if (!specialty) {
      throw new AppError(404, "Specialty not found");
    }
    return specialty;
  }
}
