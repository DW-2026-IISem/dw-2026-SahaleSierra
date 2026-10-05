import {
  ClinicalRecordResponseDto,
  CreateClinicalRecordDto,
  PatchClinicalRecordDto,
  UpdateClinicalRecordDto,
  toClinicalRecordResponse,
} from "./dto";
import { ClinicalRecordRepository } from "./clinical-record.repository";
import { ClinicalRecord, ClinicalRecordI } from "./clinical-record.model";
import { PatientRepository } from "../patient/patient.repository";
import { AppError } from "../../../shared/errors/app-error";

/**
 * Capa Service del feature ClinicalRecord — historia clínica (1:1 con Patient).
 *
 * Reglas de negocio:
 *  - Solo se crea para un paciente que exista y esté activo.
 *  - Un paciente tiene una sola historia.
 *  - `patient_id` no cambia en PUT/PATCH.
 */
export class ClinicalRecordService {
  public constructor(
    private readonly repository: ClinicalRecordRepository = new ClinicalRecordRepository(),
    private readonly patientRepository: PatientRepository = new PatientRepository()
  ) {}

  // ================== READ ==================
  public async getAll(): Promise<ClinicalRecordResponseDto[]> {
    const rows = await this.repository.findAllActive();
    return rows.map((row) => toClinicalRecordResponse(row));
  }

  public async getOne(id: number): Promise<ClinicalRecordResponseDto> {
    return toClinicalRecordResponse(await this.findOrFail(id));
  }

  /** PDF: GET /historias/:pacienteId → historia clínica de un paciente. */
  public async getByPatient(patientId: number): Promise<ClinicalRecordResponseDto> {
    const clinicalRecord = await this.repository.findByPatientId(patientId);
    if (!clinicalRecord) {
      throw new AppError(404, "Clinical record not found for this patient");
    }
    return toClinicalRecordResponse(clinicalRecord);
  }

  // ================== CREATE ==================
  /** Paciente activo y sin historia previa (1:1). */
  public async create(body: CreateClinicalRecordDto): Promise<ClinicalRecordResponseDto> {
    if (!body.patient_id) {
      throw new AppError(400, "patient_id is required");
    }

    const patient = await this.patientRepository.findById(body.patient_id);
    if (!patient) {
      throw new AppError(404, "Patient not found");
    }
    if (patient.status !== "active") {
      throw new AppError(400, "Patient must be active");
    }

    const existing = await this.repository.findByPatientId(body.patient_id);
    if (existing) {
      throw new AppError(
        400,
        `Patient already has a clinical record (id ${existing.id}, status ${existing.status})`
      );
    }

    const clinicalRecord = await this.repository.create({
      name: body.name,
      description: body.description ?? null,
      patient_id: body.patient_id,
      status: body.status ?? "active",
    });
    return toClinicalRecordResponse(clinicalRecord);
  }

  // ================== UPDATE ==================
  /** PUT: reemplaza name, description y status (patient_id no cambia). */
  public async updatePut(
    id: number,
    body: UpdateClinicalRecordDto
  ): Promise<ClinicalRecordResponseDto> {
    const clinicalRecord = await this.findOrFail(id);

    await this.repository.update(clinicalRecord, {
      name: body.name,
      description: body.description ?? null,
      status: body.status ?? clinicalRecord.status,
    });

    return toClinicalRecordResponse(clinicalRecord);
  }

  /** PATCH: name, description y/o status (patient_id no cambia). */
  public async updatePatch(
    id: number,
    body: PatchClinicalRecordDto
  ): Promise<ClinicalRecordResponseDto> {
    const clinicalRecord = await this.findOrFail(id);

    const changes: Partial<ClinicalRecordI> = {};
    if (body.name !== undefined) changes.name = body.name;
    if (body.description !== undefined) changes.description = body.description;
    if (body.status !== undefined) changes.status = body.status;

    await this.repository.update(clinicalRecord, changes);
    return toClinicalRecordResponse(clinicalRecord);
  }

  // ================== DELETE ==================
  /** Eliminación física */
  public async deletePhysical(id: number): Promise<void> {
    const clinicalRecord = await this.findOrFail(id);
    await this.repository.delete(clinicalRecord);
  }

  /** Eliminación lógica → status = inactive */
  public async deleteLogical(id: number): Promise<ClinicalRecordResponseDto> {
    const clinicalRecord = await this.findOrFail(id);
    await this.repository.update(clinicalRecord, { status: "inactive" });
    return toClinicalRecordResponse(clinicalRecord);
  }

  // ================== HELPERS ==================
  private async findOrFail(id: number): Promise<ClinicalRecord> {
    const clinicalRecord = await this.repository.findById(id);
    if (!clinicalRecord) {
      throw new AppError(404, "Clinical record not found");
    }
    return clinicalRecord;
  }
}
