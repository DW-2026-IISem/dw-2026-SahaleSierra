import {
  AgendaResponseDto,
  CreateAgendaDto,
  PatchAgendaDto,
  UpdateAgendaDto,
  toAgendaResponse,
} from "./dto";
import { AgendaRepository } from "./agenda.repository";
import { Agenda, AgendaI } from "./agenda.model";
import { DoctorRepository } from "../doctor/doctor.repository";
import { AppError } from "../../../shared/errors/app-error";

/**
 * Capa Service del feature Agenda.
 *
 * Regla de negocio propia: una agenda solo puede pertenecer a un médico que
 * exista y esté activo (se valida en create, PUT y, si llega `doctor_id`, PATCH).
 * No conoce `req`/`res` ni escribe Sequelize directamente.
 */
export class AgendaService {
  public constructor(
    private readonly repository: AgendaRepository = new AgendaRepository(),
    private readonly doctorRepository: DoctorRepository = new DoctorRepository()
  ) {}

  // ================== READ ==================
  public async getAll(): Promise<AgendaResponseDto[]> {
    const agendas = await this.repository.findAllActive();
    return agendas.map((agenda) => toAgendaResponse(agenda));
  }

  public async getOne(id: number): Promise<AgendaResponseDto> {
    return toAgendaResponse(await this.findOrFail(id));
  }

  // ================== CREATE ==================
  public async create(body: CreateAgendaDto): Promise<AgendaResponseDto> {
    await this.assertActiveDoctor(Number(body.doctor_id));

    const agenda = await this.repository.create({
      name: body.name,
      description: body.description ?? null,
      doctor_id: body.doctor_id,
      status: body.status ?? "active",
    });
    return toAgendaResponse(agenda);
  }

  // ================== UPDATE ==================
  public async updatePut(id: number, body: UpdateAgendaDto): Promise<AgendaResponseDto> {
    const agenda = await this.findOrFail(id);
    await this.assertActiveDoctor(Number(body.doctor_id));

    await this.repository.update(agenda, {
      name: body.name,
      description: body.description ?? null,
      doctor_id: body.doctor_id,
      status: body.status ?? agenda.status,
    });

    return toAgendaResponse(agenda);
  }

  public async updatePatch(id: number, body: PatchAgendaDto): Promise<AgendaResponseDto> {
    const agenda = await this.findOrFail(id);

    if (body.doctor_id !== undefined) {
      await this.assertActiveDoctor(Number(body.doctor_id));
    }

    const changes: Partial<AgendaI> = {};
    if (body.name !== undefined) changes.name = body.name;
    if (body.description !== undefined) changes.description = body.description;
    if (body.doctor_id !== undefined) changes.doctor_id = body.doctor_id;
    if (body.status !== undefined) changes.status = body.status;

    await this.repository.update(agenda, changes);
    return toAgendaResponse(agenda);
  }

  // ================== DELETE ==================
  /** Eliminación física */
  public async deletePhysical(id: number): Promise<void> {
    const agenda = await this.findOrFail(id);
    await this.repository.delete(agenda);
  }

  /** Eliminación lógica → status = inactive */
  public async deleteLogical(id: number): Promise<AgendaResponseDto> {
    const agenda = await this.findOrFail(id);
    await this.repository.update(agenda, { status: "inactive" });
    return toAgendaResponse(agenda);
  }

  // ================== HELPERS ==================
  /** Devuelve la agenda o lanza 404 (no filtra por estado, igual que en Fase I). */
  private async findOrFail(id: number): Promise<Agenda> {
    const agenda = await this.repository.findById(id);
    if (!agenda) {
      throw new AppError(404, "Agenda not found");
    }
    return agenda;
  }

  /** El médico debe existir (404) y estar activo (400). */
  private async assertActiveDoctor(doctor_id: number): Promise<void> {
    const doctor = await this.doctorRepository.findById(doctor_id);
    if (!doctor) {
      throw new AppError(404, "Doctor not found");
    }
    if (doctor.status !== "active") {
      throw new AppError(400, "Doctor must be active");
    }
  }
}
