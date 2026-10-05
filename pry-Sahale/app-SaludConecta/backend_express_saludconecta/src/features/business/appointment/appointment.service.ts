import { Transaction } from "sequelize";
import {
  AppointmentResponseDto,
  CreateAppointmentDto,
  PatchAppointmentDto,
  UpdateAppointmentDto,
  toAppointmentResponse,
} from "./dto";
import { AppointmentRepository } from "./appointment.repository";
import { Appointment, AppointmentI, AppointmentState } from "./appointment.model";
import { AgendaRepository } from "../agenda/agenda.repository";
import { DoctorRepository } from "../doctor/doctor.repository";
import { PatientRepository } from "../patient/patient.repository";
import { AppError } from "../../../shared/errors/app-error";
import { withTransaction } from "../../../shared/database/with-transaction";

/**
 * Capa Service del feature Appointment — citas.
 *
 * Reglas de negocio:
 *  - Agenda activa (con su médico activo) y paciente activo.
 *  - `end_date` posterior a `start_date`.
 *  - Sin cruce de horario con otra cita activa y no cancelada de la misma agenda.
 *  - Una cita nace en `scheduled`.
 *  - Regla del PDF: `attended` solo lo fija `POST /api/encounters`; una cita
 *    atendida no cambia de estado desde aquí.
 *
 * El alta es transaccional (`withTransaction`): cualquier `AppError` lanzado
 * dentro revierte todo.
 */
export class AppointmentService {
  public constructor(
    private readonly repository: AppointmentRepository = new AppointmentRepository(),
    private readonly agendaRepository: AgendaRepository = new AgendaRepository(),
    private readonly doctorRepository: DoctorRepository = new DoctorRepository(),
    private readonly patientRepository: PatientRepository = new PatientRepository()
  ) {}

  // ================== READ ==================
  public async getAll(): Promise<AppointmentResponseDto[]> {
    const appointments = await this.repository.findAllActive();
    return appointments.map((appointment) => toAppointmentResponse(appointment));
  }

  public async getOne(id: number): Promise<AppointmentResponseDto> {
    const appointment = await this.repository.findByIdWithRelations(id);
    if (!appointment) {
      throw new AppError(404, "Appointment not found");
    }
    return toAppointmentResponse(appointment);
  }

  // ================== CREATE ==================
  /** Transaccional: agenda y médico activos, paciente activo, rango válido, sin cruce. */
  public async create(body: CreateAppointmentDto): Promise<AppointmentResponseDto> {
    if (!body.agenda_id || !body.patient_id || !body.start_date || !body.end_date) {
      throw new AppError(400, "agenda_id, patient_id, start_date and end_date are required");
    }

    this.assertValidRange(body.start_date, body.end_date);

    const appointment = await withTransaction(async (t) => {
      await this.assertActiveParents(Number(body.agenda_id), Number(body.patient_id), t);
      await this.assertNoOverlap(
        Number(body.agenda_id),
        body.start_date,
        body.end_date,
        null,
        t
      );

      return this.repository.create(
        {
          start_date: body.start_date,
          end_date: body.end_date,
          reason: body.reason ?? null,
          state: "scheduled",
          agenda_id: body.agenda_id,
          patient_id: body.patient_id,
          status: body.status ?? "active",
        },
        t
      );
    });

    return toAppointmentResponse(appointment);
  }

  // ================== UPDATE ==================
  public async updatePut(
    id: number,
    body: UpdateAppointmentDto
  ): Promise<AppointmentResponseDto> {
    const appointment = await this.findOrFail(id);
    await this.validateChanges(appointment, body);

    await this.repository.update(appointment, {
      start_date: body.start_date ?? appointment.start_date,
      end_date: body.end_date ?? appointment.end_date,
      reason: body.reason ?? null,
      state: body.state ?? appointment.state,
      agenda_id: body.agenda_id ?? appointment.agenda_id,
      patient_id: body.patient_id ?? appointment.patient_id,
      status: body.status ?? appointment.status,
    });

    return toAppointmentResponse(appointment);
  }

  public async updatePatch(
    id: number,
    body: PatchAppointmentDto
  ): Promise<AppointmentResponseDto> {
    const appointment = await this.findOrFail(id);
    await this.validateChanges(appointment, body);

    const changes: Partial<AppointmentI> = {};
    if (body.start_date !== undefined) changes.start_date = body.start_date;
    if (body.end_date !== undefined) changes.end_date = body.end_date;
    if (body.reason !== undefined) changes.reason = body.reason;
    if (body.state !== undefined) changes.state = body.state;
    if (body.agenda_id !== undefined) changes.agenda_id = body.agenda_id;
    if (body.patient_id !== undefined) changes.patient_id = body.patient_id;
    if (body.status !== undefined) changes.status = body.status;

    await this.repository.update(appointment, changes);
    return toAppointmentResponse(appointment);
  }

  // ================== DELETE ==================
  /** Eliminación física */
  public async deletePhysical(id: number): Promise<void> {
    const appointment = await this.findOrFail(id);
    await this.repository.delete(appointment);
  }

  /** Eliminación lógica → status = inactive */
  public async deleteLogical(id: number): Promise<AppointmentResponseDto> {
    const appointment = await this.findOrFail(id);
    await this.repository.update(appointment, { status: "inactive" });
    return toAppointmentResponse(appointment);
  }

  // ================== HELPERS ==================
  private async findOrFail(id: number): Promise<Appointment> {
    const appointment = await this.repository.findById(id);
    if (!appointment) {
      throw new AppError(404, "Appointment not found");
    }
    return appointment;
  }

  /** Agenda activa (con médico activo) y paciente activo. */
  private async assertActiveParents(
    agenda_id: number,
    patient_id: number,
    t?: Transaction
  ): Promise<void> {
    const agenda = await this.agendaRepository.findById(agenda_id, t, true);
    if (!agenda) {
      throw new AppError(404, "Agenda not found");
    }
    if (agenda.status !== "active") {
      throw new AppError(400, "Agenda must be active");
    }

    const doctor = await this.doctorRepository.findById(agenda.doctor_id, t);
    if (!doctor || doctor.status !== "active") {
      throw new AppError(400, "Agenda doctor must be active");
    }

    const patient = await this.patientRepository.findById(patient_id, t);
    if (!patient) {
      throw new AppError(404, "Patient not found");
    }
    if (patient.status !== "active") {
      throw new AppError(400, "Patient must be active");
    }
  }

  private assertValidRange(start: Date | string, end: Date | string): void {
    const s = new Date(start);
    const e = new Date(end);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) {
      throw new AppError(400, "start_date and end_date must be valid dates");
    }
    if (e.getTime() <= s.getTime()) {
      throw new AppError(400, "end_date must be after start_date");
    }
  }

  /** Sin cruce de horario con otra cita activa (no cancelada) de la misma agenda. */
  private async assertNoOverlap(
    agenda_id: number,
    start: Date | string,
    end: Date | string,
    excludeId: number | null,
    t?: Transaction
  ): Promise<void> {
    const overlap = await this.repository.findOverlap(
      agenda_id,
      new Date(start),
      new Date(end),
      excludeId,
      t
    );
    if (overlap) {
      throw new AppError(
        400,
        `Agenda already has an appointment in that time range (id ${overlap.id})`
      );
    }
  }

  /** Regla del PDF: solo POST /api/encounters pasa una cita a "attended". */
  private assertStateChange(current: AppointmentState, next: AppointmentState): void {
    if (next === current) {
      return;
    }
    if (next === "attended") {
      throw new AppError(
        400,
        "State 'attended' is set only by POST /api/encounters (requires clinical record)"
      );
    }
    if (current === "attended") {
      throw new AppError(400, "An attended appointment cannot change its state");
    }
  }

  /** Valida los cambios de PUT/PATCH con los valores finales (body ?? actuales). */
  private async validateChanges(
    appointment: Appointment,
    body: UpdateAppointmentDto
  ): Promise<void> {
    const nextState = (body.state ?? appointment.state) as AppointmentState;
    this.assertStateChange(appointment.state, nextState);

    const agenda_id = Number(body.agenda_id ?? appointment.agenda_id);
    const patient_id = Number(body.patient_id ?? appointment.patient_id);
    const start = body.start_date ?? appointment.start_date;
    const end = body.end_date ?? appointment.end_date;

    this.assertValidRange(start, end);

    if (body.agenda_id !== undefined || body.patient_id !== undefined) {
      await this.assertActiveParents(agenda_id, patient_id);
    }

    if (nextState !== "cancelled") {
      await this.assertNoOverlap(agenda_id, start, end, appointment.id);
    }
  }
}
