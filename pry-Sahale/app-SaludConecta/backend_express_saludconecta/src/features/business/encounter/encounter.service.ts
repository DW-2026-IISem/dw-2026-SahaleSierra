import {
  CreateEncounterDto,
  EncounterResponseDto,
  PatchEncounterDto,
  UpdateEncounterDto,
  toEncounterResponse,
} from "./dto";
import { EncounterRepository } from "./encounter.repository";
import { Encounter, EncounterI } from "./encounter.model";
import { AppointmentRepository } from "../appointment/appointment.repository";
import { AppointmentResponseDto, toAppointmentResponse } from "../appointment/dto";
import { AgendaRepository } from "../agenda/agenda.repository";
import { DoctorRepository } from "../doctor/doctor.repository";
import { PatientRepository } from "../patient/patient.repository";
import { ClinicalRecordRepository } from "../clinical-record/clinical-record.repository";
import { ServiceRepository } from "../service/service.repository";
import { AppError } from "../../../shared/errors/app-error";
import { withTransaction } from "../../../shared/database/with-transaction";

/** Resultado de registrar una atención: la atención y la cita ya en `attended`. */
export interface EncounterCreatedDto {
  encounter: EncounterResponseDto;
  appointment: AppointmentResponseDto;
}

/**
 * Capa Service del feature Encounter — atenciones.
 *
 * Aquí vive la **regla central del PDF**: una cita solo pasa a `attended` con
 * profesional (médico de la agenda activo), paciente activo y registro clínico
 * (historia clínica activa del paciente). Además: servicio activo.
 *
 * Otras reglas:
 *  - Una cita tiene como máximo una atención.
 *  - Las FKs no cambian en PUT/PATCH.
 *  - Una atención facturada (`invoice_id` no nulo) no se borra ni cambia su total.
 *  - Borrar una atención devuelve la cita a `scheduled`.
 *
 * El alta y el borrado son transaccionales (`withTransaction`): cualquier
 * `AppError` lanzado dentro revierte todo.
 */
export class EncounterService {
  public constructor(
    private readonly repository: EncounterRepository = new EncounterRepository(),
    private readonly appointmentRepository: AppointmentRepository = new AppointmentRepository(),
    private readonly agendaRepository: AgendaRepository = new AgendaRepository(),
    private readonly doctorRepository: DoctorRepository = new DoctorRepository(),
    private readonly patientRepository: PatientRepository = new PatientRepository(),
    private readonly clinicalRecordRepository: ClinicalRecordRepository = new ClinicalRecordRepository(),
    private readonly serviceRepository: ServiceRepository = new ServiceRepository()
  ) {}

  // ================== READ ==================
  public async getAll(): Promise<EncounterResponseDto[]> {
    const encounters = await this.repository.findAllActive();
    return encounters.map((encounter) => toEncounterResponse(encounter));
  }

  public async getOne(id: number): Promise<EncounterResponseDto> {
    const encounter = await this.repository.findByIdWithRelations(id);
    if (!encounter) {
      throw new AppError(404, "Encounter not found");
    }
    return toEncounterResponse(encounter);
  }

  // ================== CREATE ==================
  /** Transaccional: aplica la regla del PDF y deja la cita en `attended`. */
  public async create(body: CreateEncounterDto): Promise<EncounterCreatedDto> {
    if (!body.appointment_id || !body.service_id) {
      throw new AppError(400, "appointment_id and service_id are required");
    }

    if (body.state !== undefined && body.state !== "in_progress" && body.state !== "completed") {
      throw new AppError(400, "state on create must be 'in_progress' or 'completed'");
    }

    this.assertValidTotal(body.total ?? 0);

    return withTransaction(async (t) => {
      // 1) Cita: activa y programada
      const appointment = await this.appointmentRepository.findById(body.appointment_id, t, true);
      if (!appointment) {
        throw new AppError(404, "Appointment not found");
      }
      if (appointment.status !== "active") {
        throw new AppError(400, "Appointment must be active");
      }
      if (appointment.state !== "scheduled") {
        throw new AppError(
          400,
          `Appointment must be 'scheduled' (current: '${appointment.state}')`
        );
      }

      const existing = await this.repository.findByAppointmentId(appointment.id, t);
      if (existing) {
        throw new AppError(400, `Appointment already has an encounter (id ${existing.id})`);
      }

      // 2) Profesional: médico de la agenda activo
      const agenda = await this.agendaRepository.findById(appointment.agenda_id, t);
      const doctor = agenda ? await this.doctorRepository.findById(agenda.doctor_id, t) : null;
      if (!agenda || !doctor || doctor.status !== "active") {
        throw new AppError(400, "Appointment doctor must exist and be active");
      }

      // 3) Paciente activo
      const patient = await this.patientRepository.findById(appointment.patient_id, t);
      if (!patient || patient.status !== "active") {
        throw new AppError(400, "Appointment patient must exist and be active");
      }

      // 4) Registro clínico: historia clínica activa del paciente
      const clinicalRecord = await this.clinicalRecordRepository.findByPatientId(patient.id, t);
      if (!clinicalRecord || clinicalRecord.status !== "active") {
        throw new AppError(400, "Patient must have an active clinical record");
      }

      // 5) Servicio activo
      const service = await this.serviceRepository.findById(body.service_id, t);
      if (!service) {
        throw new AppError(404, "Service not found");
      }
      if (service.status !== "active") {
        throw new AppError(400, "Service must be active");
      }

      const start_date = body.start_date ?? appointment.start_date;
      const end_date = body.end_date ?? null;
      this.assertValidRange(start_date, end_date);

      const encounter = await this.repository.create(
        {
          appointment_id: appointment.id,
          clinical_record_id: clinicalRecord.id,
          service_id: service.id,
          start_date,
          end_date,
          total: Number(body.total ?? 0),
          state: body.state ?? "in_progress",
          observations: body.observations ?? null,
          status: body.status ?? "active",
        },
        t
      );

      await this.appointmentRepository.update(appointment, { state: "attended" }, t);

      return {
        encounter: toEncounterResponse(encounter),
        appointment: toAppointmentResponse(appointment),
      };
    });
  }

  // ================== UPDATE ==================
  /** PUT: reemplaza datos de la atención (las FKs no cambian). */
  public async updatePut(id: number, body: UpdateEncounterDto): Promise<EncounterResponseDto> {
    const encounter = await this.findOrFail(id);

    const total = body.total ?? 0;
    this.assertValidTotal(total);
    this.assertTotalUnchangedIfBilled(encounter, total);

    const start_date = body.start_date ?? encounter.start_date;
    const end_date = body.end_date ?? null;
    this.assertValidRange(start_date, end_date);

    await this.repository.update(encounter, {
      start_date,
      end_date,
      total: Number(total),
      state: body.state ?? encounter.state,
      observations: body.observations ?? null,
      status: body.status ?? encounter.status,
    });

    return toEncounterResponse(encounter);
  }

  /** PATCH: datos parciales de la atención (las FKs no cambian). */
  public async updatePatch(id: number, body: PatchEncounterDto): Promise<EncounterResponseDto> {
    const encounter = await this.findOrFail(id);

    if (body.total !== undefined) {
      this.assertValidTotal(body.total);
      this.assertTotalUnchangedIfBilled(encounter, body.total);
    }

    this.assertValidRange(
      body.start_date ?? encounter.start_date,
      body.end_date !== undefined ? body.end_date : encounter.end_date
    );

    const changes: Partial<EncounterI> = {};
    if (body.start_date !== undefined) changes.start_date = body.start_date;
    if (body.end_date !== undefined) changes.end_date = body.end_date;
    if (body.total !== undefined) changes.total = Number(body.total);
    if (body.state !== undefined) changes.state = body.state;
    if (body.observations !== undefined) changes.observations = body.observations;
    if (body.status !== undefined) changes.status = body.status;

    await this.repository.update(encounter, changes);
    return toEncounterResponse(encounter);
  }

  // ================== DELETE ==================
  /** Eliminación física: borra la atención y la cita vuelve a "scheduled" (transacción). */
  public async deletePhysical(id: number): Promise<void> {
    await withTransaction(async (t) => {
      const encounter = await this.repository.findById(id, t);
      if (!encounter) {
        throw new AppError(404, "Encounter not found");
      }
      if (encounter.invoice_id !== null) {
        throw new AppError(
          400,
          `Billed encounter cannot be deleted (delete the invoice first; invoice_id ${encounter.invoice_id})`
        );
      }

      const appointment = await this.appointmentRepository.findById(encounter.appointment_id, t);
      await this.repository.delete(encounter, t);
      if (appointment && appointment.state === "attended") {
        await this.appointmentRepository.update(appointment, { state: "scheduled" }, t);
      }
    });
  }

  /** Eliminación lógica → status = inactive */
  public async deleteLogical(id: number): Promise<EncounterResponseDto> {
    const encounter = await this.findOrFail(id);
    await this.repository.update(encounter, { status: "inactive" });
    return toEncounterResponse(encounter);
  }

  // ================== HELPERS ==================
  private async findOrFail(id: number): Promise<Encounter> {
    const encounter = await this.repository.findById(id);
    if (!encounter) {
      throw new AppError(404, "Encounter not found");
    }
    return encounter;
  }

  private assertValidTotal(total: unknown): void {
    const value = Number(total);
    if (isNaN(value) || value < 0) {
      throw new AppError(400, "total must be a number >= 0");
    }
  }

  /** Una atención ya facturada no puede cambiar su total (descuadraría la factura). */
  private assertTotalUnchangedIfBilled(encounter: Encounter, total: unknown): void {
    if (encounter.invoice_id !== null && Number(total) !== Number(encounter.total)) {
      throw new AppError(
        400,
        `Billed encounter total cannot change (invoice_id ${encounter.invoice_id})`
      );
    }
  }

  private assertValidRange(start: Date | string, end: Date | string | null | undefined): void {
    const s = new Date(start);
    if (isNaN(s.getTime())) {
      throw new AppError(400, "start_date must be a valid date");
    }
    if (end === null || end === undefined) {
      return;
    }
    const e = new Date(end);
    if (isNaN(e.getTime())) {
      throw new AppError(400, "end_date must be a valid date");
    }
    if (e.getTime() <= s.getTime()) {
      throw new AppError(400, "end_date must be after start_date");
    }
  }
}
