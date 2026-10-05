import {
  CreateDoctorSpecialtyDto,
  DoctorSpecialtyResponseDto,
  PatchDoctorSpecialtyDto,
  UpdateDoctorSpecialtyDto,
  toDoctorSpecialtyResponse,
} from "./dto";
import { DoctorSpecialtyRepository } from "./doctor-specialty.repository";
import { DoctorSpecialty, DoctorSpecialtyI } from "./doctor-specialty.model";
import { DoctorRepository } from "../doctor/doctor.repository";
import { SpecialtyRepository } from "../specialty/specialty.repository";
import { AppError } from "../../../shared/errors/app-error";

/**
 * Capa Service del feature DoctorSpecialty — relación N:M médico ↔ especialidad.
 *
 * Reglas de negocio:
 *  - Solo se relacionan un médico y una especialidad **activos** (al crear y
 *    al reactivar la relación).
 *  - El par `(doctor_id, specialty_id)` no se repite.
 *  - El par no cambia en PUT/PATCH: solo `relation_data` y `status`.
 */
export class DoctorSpecialtyService {
  public constructor(
    private readonly repository: DoctorSpecialtyRepository = new DoctorSpecialtyRepository(),
    private readonly doctorRepository: DoctorRepository = new DoctorRepository(),
    private readonly specialtyRepository: SpecialtyRepository = new SpecialtyRepository()
  ) {}

  // ================== READ ==================
  public async getAll(): Promise<DoctorSpecialtyResponseDto[]> {
    const rows = await this.repository.findAllActive();
    return rows.map((row) => toDoctorSpecialtyResponse(row));
  }

  public async getOne(id: number): Promise<DoctorSpecialtyResponseDto> {
    return toDoctorSpecialtyResponse(await this.findOrFail(id));
  }

  // ================== CREATE ==================
  /** Asigna una especialidad a un médico (ambos activos, par no repetido). */
  public async create(body: CreateDoctorSpecialtyDto): Promise<DoctorSpecialtyResponseDto> {
    if (!body.doctor_id || !body.specialty_id) {
      throw new AppError(400, "doctor_id and specialty_id are required");
    }

    await this.assertActiveParents(Number(body.doctor_id), Number(body.specialty_id));

    const existing = await this.repository.findByPair(body.doctor_id, body.specialty_id);
    if (existing) {
      throw new AppError(
        400,
        `Doctor already has this specialty (id ${existing.id}, status ${existing.status})`
      );
    }

    const doctorSpecialty = await this.repository.create({
      doctor_id: body.doctor_id,
      specialty_id: body.specialty_id,
      relation_data: body.relation_data ?? null,
      status: body.status ?? "active",
    });
    return toDoctorSpecialtyResponse(doctorSpecialty);
  }

  // ================== UPDATE ==================
  /** PUT: reemplaza relation_data y status (el par doctor/specialty no cambia). */
  public async updatePut(
    id: number,
    body: UpdateDoctorSpecialtyDto
  ): Promise<DoctorSpecialtyResponseDto> {
    const doctorSpecialty = await this.findOrFail(id);

    const nextStatus = body.status ?? doctorSpecialty.status;
    if (nextStatus === "active") {
      await this.assertActiveParents(doctorSpecialty.doctor_id, doctorSpecialty.specialty_id);
    }

    await this.repository.update(doctorSpecialty, {
      relation_data: body.relation_data ?? null,
      status: nextStatus,
    });

    return toDoctorSpecialtyResponse(doctorSpecialty);
  }

  /** PATCH: relation_data y/o status (el par doctor/specialty no cambia). */
  public async updatePatch(
    id: number,
    body: PatchDoctorSpecialtyDto
  ): Promise<DoctorSpecialtyResponseDto> {
    const doctorSpecialty = await this.findOrFail(id);

    if (body.status === "active") {
      await this.assertActiveParents(doctorSpecialty.doctor_id, doctorSpecialty.specialty_id);
    }

    const changes: Partial<DoctorSpecialtyI> = {};
    if (body.relation_data !== undefined) changes.relation_data = body.relation_data;
    if (body.status !== undefined) changes.status = body.status;

    await this.repository.update(doctorSpecialty, changes);
    return toDoctorSpecialtyResponse(doctorSpecialty);
  }

  // ================== DELETE ==================
  /** Eliminación física */
  public async deletePhysical(id: number): Promise<void> {
    const doctorSpecialty = await this.findOrFail(id);
    await this.repository.delete(doctorSpecialty);
  }

  /** Eliminación lógica → status = inactive */
  public async deleteLogical(id: number): Promise<DoctorSpecialtyResponseDto> {
    const doctorSpecialty = await this.findOrFail(id);
    await this.repository.update(doctorSpecialty, { status: "inactive" });
    return toDoctorSpecialtyResponse(doctorSpecialty);
  }

  // ================== HELPERS ==================
  private async findOrFail(id: number): Promise<DoctorSpecialty> {
    const doctorSpecialty = await this.repository.findById(id);
    if (!doctorSpecialty) {
      throw new AppError(404, "Doctor specialty not found");
    }
    return doctorSpecialty;
  }

  /** Médico y especialidad deben existir (404) y estar activos (400). */
  private async assertActiveParents(doctor_id: number, specialty_id: number): Promise<void> {
    const doctor = await this.doctorRepository.findById(doctor_id);
    if (!doctor) {
      throw new AppError(404, "Doctor not found");
    }
    if (doctor.status !== "active") {
      throw new AppError(400, "Doctor must be active");
    }

    const specialty = await this.specialtyRepository.findById(specialty_id);
    if (!specialty) {
      throw new AppError(404, "Specialty not found");
    }
    if (specialty.status !== "active") {
      throw new AppError(400, "Specialty must be active");
    }
  }
}
