import {
  CreateDoctorDto,
  PatchDoctorDto,
  DoctorResponseDto,
  UpdateDoctorDto,
  toDoctorResponse,
} from "./dto";
import { DoctorRepository } from "./doctor.repository";
import { Doctor, DoctorI } from "./doctor.model";
import { AppError } from "../../../shared/errors/app-error";

/**
 * Capa Service del feature Doctor.
 *
 * Reglas de negocio: default de `status` al crear, conservación del estado en
 * PUT y política de borrado lógico. No conoce `req`/`res` ni escribe Sequelize
 * directamente: los errores de negocio se lanzan como `AppError`.
 */
export class DoctorService {
  public constructor(
    private readonly repository: DoctorRepository = new DoctorRepository()
  ) {}

  // ================== READ ==================
  public async getAll(): Promise<DoctorResponseDto[]> {
    const doctors = await this.repository.findAllActive();
    return doctors.map((doctor) => toDoctorResponse(doctor));
  }

  public async getOne(id: number): Promise<DoctorResponseDto> {
    return toDoctorResponse(await this.findOrFail(id));
  }

  // ================== CREATE ==================
  public async create(body: CreateDoctorDto): Promise<DoctorResponseDto> {
    const doctor = await this.repository.create({
      name: body.name,
      description: body.description ?? null,
      status: body.status ?? "active",
    });
    return toDoctorResponse(doctor);
  }

  // ================== UPDATE ==================
  public async updatePut(id: number, body: UpdateDoctorDto): Promise<DoctorResponseDto> {
    const doctor = await this.findOrFail(id);

    await this.repository.update(doctor, {
      name: body.name,
      description: body.description ?? null,
      status: body.status ?? doctor.status,
    });

    return toDoctorResponse(doctor);
  }

  public async updatePatch(id: number, body: PatchDoctorDto): Promise<DoctorResponseDto> {
    const doctor = await this.findOrFail(id);

    const changes: Partial<DoctorI> = {};
    if (body.name !== undefined) changes.name = body.name;
    if (body.description !== undefined) changes.description = body.description;
    if (body.status !== undefined) changes.status = body.status;

    await this.repository.update(doctor, changes);
    return toDoctorResponse(doctor);
  }

  // ================== DELETE ==================
  /** Eliminación física */
  public async deletePhysical(id: number): Promise<void> {
    const doctor = await this.findOrFail(id);
    await this.repository.delete(doctor);
  }

  /** Eliminación lógica → status = inactive */
  public async deleteLogical(id: number): Promise<DoctorResponseDto> {
    const doctor = await this.findOrFail(id);
    await this.repository.update(doctor, { status: "inactive" });
    return toDoctorResponse(doctor);
  }

  // ================== HELPERS ==================
  /** Devuelve el registro o lanza 404 (no filtra por estado, igual que en Fase I). */
  private async findOrFail(id: number): Promise<Doctor> {
    const doctor = await this.repository.findById(id);
    if (!doctor) {
      throw new AppError(404, "Doctor not found");
    }
    return doctor;
  }
}
