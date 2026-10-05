import {
  CreatePatientDto,
  PatchPatientDto,
  PatientResponseDto,
  UpdatePatientDto,
  toPatientResponse,
} from "./dto";
import { PatientRepository } from "./patient.repository";
import { Patient, PatientI } from "./patient.model";
import { AppError } from "../../../shared/errors/app-error";

/**
 * Capa Service del feature Patient.
 *
 * Reglas de negocio: default de `status` al crear, conservación del estado en
 * PUT y política de borrado lógico. No conoce `req`/`res` ni escribe Sequelize
 * directamente: los errores de negocio se lanzan como `AppError`.
 */
export class PatientService {
  public constructor(
    private readonly repository: PatientRepository = new PatientRepository()
  ) {}

  // ================== READ ==================
  public async getAll(): Promise<PatientResponseDto[]> {
    const patients = await this.repository.findAllActive();
    return patients.map((patient) => toPatientResponse(patient));
  }

  public async getOne(id: number): Promise<PatientResponseDto> {
    return toPatientResponse(await this.findOrFail(id));
  }

  // ================== CREATE ==================
  public async create(body: CreatePatientDto): Promise<PatientResponseDto> {
    const patient = await this.repository.create({
      document_type: body.document_type,
      document_number: body.document_number,
      name: body.name,
      birth_date: body.birth_date,
      contact: body.contact,
      status: body.status ?? "active",
    });
    return toPatientResponse(patient);
  }

  // ================== UPDATE ==================
  public async updatePut(id: number, body: UpdatePatientDto): Promise<PatientResponseDto> {
    const patient = await this.findOrFail(id);

    await this.repository.update(patient, {
      document_type: body.document_type,
      document_number: body.document_number,
      name: body.name,
      birth_date: body.birth_date,
      contact: body.contact,
      status: body.status ?? patient.status,
    });

    return toPatientResponse(patient);
  }

  public async updatePatch(id: number, body: PatchPatientDto): Promise<PatientResponseDto> {
    const patient = await this.findOrFail(id);

    const changes: Partial<PatientI> = {};
    if (body.document_type !== undefined) changes.document_type = body.document_type;
    if (body.document_number !== undefined) changes.document_number = body.document_number;
    if (body.name !== undefined) changes.name = body.name;
    if (body.birth_date !== undefined) changes.birth_date = body.birth_date;
    if (body.contact !== undefined) changes.contact = body.contact;
    if (body.status !== undefined) changes.status = body.status;

    await this.repository.update(patient, changes);
    return toPatientResponse(patient);
  }

  // ================== DELETE ==================
  /** Eliminación física */
  public async deletePhysical(id: number): Promise<void> {
    const patient = await this.findOrFail(id);
    await this.repository.delete(patient);
  }

  /** Eliminación lógica → status = inactive */
  public async deleteLogical(id: number): Promise<PatientResponseDto> {
    const patient = await this.findOrFail(id);
    await this.repository.update(patient, { status: "inactive" });
    return toPatientResponse(patient);
  }

  // ================== HELPERS ==================
  /** Devuelve el paciente o lanza 404 (no filtra por estado, igual que en Fase I). */
  private async findOrFail(id: number): Promise<Patient> {
    const patient = await this.repository.findById(id);
    if (!patient) {
      throw new AppError(404, "Patient not found");
    }
    return patient;
  }
}
