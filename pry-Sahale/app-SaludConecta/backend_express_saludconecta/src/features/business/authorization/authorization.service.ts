import {
  AuthorizationResponseDto,
  CreateAuthorizationDto,
  PatchAuthorizationDto,
  UpdateAuthorizationDto,
  toAuthorizationResponse,
} from "./dto";
import { AuthorizationRepository } from "./authorization.repository";
import { Authorization, AuthorizationI } from "./authorization.model";
import { AppointmentRepository } from "../appointment/appointment.repository";
import { AppError } from "../../../shared/errors/app-error";

/**
 * Capa Service del feature Authorization — autorización (0..1:1 con Appointment).
 *
 * Reglas de negocio:
 *  - Solo se autoriza una cita que exista, esté activa y no esté cancelada.
 *  - Una cita tiene como máximo una autorización.
 *  - `appointment_id` no cambia en PUT/PATCH.
 */
export class AuthorizationService {
  public constructor(
    private readonly repository: AuthorizationRepository = new AuthorizationRepository(),
    private readonly appointmentRepository: AppointmentRepository = new AppointmentRepository()
  ) {}

  // ================== READ ==================
  public async getAll(): Promise<AuthorizationResponseDto[]> {
    const rows = await this.repository.findAllActive();
    return rows.map((row) => toAuthorizationResponse(row));
  }

  public async getOne(id: number): Promise<AuthorizationResponseDto> {
    return toAuthorizationResponse(await this.findOrFail(id));
  }

  // ================== CREATE ==================
  /** Cita activa y no cancelada; máximo una autorización por cita (0..1:1). */
  public async create(body: CreateAuthorizationDto): Promise<AuthorizationResponseDto> {
    if (!body.appointment_id) {
      throw new AppError(400, "appointment_id is required");
    }

    await this.assertAuthorizableAppointment(Number(body.appointment_id));

    const existing = await this.repository.findByAppointmentId(body.appointment_id);
    if (existing) {
      throw new AppError(
        400,
        `Appointment already has an authorization (id ${existing.id}, status ${existing.status})`
      );
    }

    const authorization = await this.repository.create({
      name: body.name,
      description: body.description ?? null,
      appointment_id: body.appointment_id,
      status: body.status ?? "active",
    });
    return toAuthorizationResponse(authorization);
  }

  // ================== UPDATE ==================
  /** PUT: reemplaza name, description y status (appointment_id no cambia). */
  public async updatePut(
    id: number,
    body: UpdateAuthorizationDto
  ): Promise<AuthorizationResponseDto> {
    const authorization = await this.findOrFail(id);

    await this.repository.update(authorization, {
      name: body.name,
      description: body.description ?? null,
      status: body.status ?? authorization.status,
    });

    return toAuthorizationResponse(authorization);
  }

  /** PATCH: name, description y/o status (appointment_id no cambia). */
  public async updatePatch(
    id: number,
    body: PatchAuthorizationDto
  ): Promise<AuthorizationResponseDto> {
    const authorization = await this.findOrFail(id);

    const changes: Partial<AuthorizationI> = {};
    if (body.name !== undefined) changes.name = body.name;
    if (body.description !== undefined) changes.description = body.description;
    if (body.status !== undefined) changes.status = body.status;

    await this.repository.update(authorization, changes);
    return toAuthorizationResponse(authorization);
  }

  // ================== DELETE ==================
  /** Eliminación física */
  public async deletePhysical(id: number): Promise<void> {
    const authorization = await this.findOrFail(id);
    await this.repository.delete(authorization);
  }

  /** Eliminación lógica → status = inactive */
  public async deleteLogical(id: number): Promise<AuthorizationResponseDto> {
    const authorization = await this.findOrFail(id);
    await this.repository.update(authorization, { status: "inactive" });
    return toAuthorizationResponse(authorization);
  }

  // ================== HELPERS ==================
  private async findOrFail(id: number): Promise<Authorization> {
    const authorization = await this.repository.findById(id);
    if (!authorization) {
      throw new AppError(404, "Authorization not found");
    }
    return authorization;
  }

  /** La cita debe existir (404), estar activa y no estar cancelada (400). */
  private async assertAuthorizableAppointment(appointment_id: number): Promise<void> {
    const appointment = await this.appointmentRepository.findById(appointment_id);
    if (!appointment) {
      throw new AppError(404, "Appointment not found");
    }
    if (appointment.status !== "active") {
      throw new AppError(400, "Appointment must be active");
    }
    if (appointment.state === "cancelled") {
      throw new AppError(400, "Cannot authorize a cancelled appointment");
    }
  }
}
