import { Request, Response } from "express";
import { sequelize } from "../../../database/db";
import { Encounter, EncounterI, EncounterState } from "./encounter.model";
import { Appointment } from "../appointment/appointment.model";
import { Agenda } from "../agenda/agenda.model";
import { Doctor } from "../doctor/doctor.model";
import { Patient } from "../patient/patient.model";
import { ClinicalRecord } from "../clinical-record/clinical-record.model";
import { Service } from "../service/service.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

type Check = { ok: true } | { ok: false; status: number; error: string };

type EncounterCreateBody = {
  appointment_id: number;
  service_id: number;
  start_date?: Date | string;
  end_date?: Date | string | null;
  total?: number;
  state?: EncounterState;
  observations?: string | null;
  status?: "active" | "inactive";
};

type EncounterEditableBody = Partial<
  Pick<EncounterI, "start_date" | "end_date" | "total" | "state" | "observations" | "status">
>;

function assertValidTotal(total: unknown): Check {
  const value = Number(total);
  if (isNaN(value) || value < 0) {
    return { ok: false, status: 400, error: "total must be a number >= 0" };
  }
  return { ok: true };
}

function assertValidRange(start: Date | string, end: Date | string | null | undefined): Check {
  const s = new Date(start);
  if (isNaN(s.getTime())) {
    return { ok: false, status: 400, error: "start_date must be a valid date" };
  }
  if (end === null || end === undefined) {
    return { ok: true };
  }
  const e = new Date(end);
  if (isNaN(e.getTime())) {
    return { ok: false, status: 400, error: "end_date must be a valid date" };
  }
  if (e.getTime() <= s.getTime()) {
    return { ok: false, status: 400, error: "end_date must be after start_date" };
  }
  return { ok: true };
}

const INCLUDE_RELATIONS = [
  { model: Appointment, as: "appointment" },
  { model: ClinicalRecord, as: "clinical_record" },
  { model: Service, as: "service" },
];

export class EncounterController {
  // ================== READ ==================
  public async getAll(req: Request, res: Response) {
    try {
      const encounters = await Encounter.findAll({
        where: { status: "active" },
        include: INCLUDE_RELATIONS,
      });
      res.status(200).json({ encounters });
    } catch (error) {
      res.status(500).json({ error: "Error fetching encounters", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const encounter = await Encounter.findByPk(id, { include: INCLUDE_RELATIONS });
      if (!encounter) {
        res.status(404).json({ error: "Encounter not found" });
        return;
      }
      res.status(200).json({ encounter });
    } catch (error) {
      res.status(500).json({ error: "Error fetching encounter", detail: String(error) });
    }
  }

  // ================== CREATE ==================
  /**
   * Transaccional (regla del PDF): la cita pasa a "attended" solo si hay
   * profesional (médico de la agenda activo), paciente activo y registro clínico
   * (historia clínica activa del paciente). Además: servicio activo.
   */
  public async create(req: Request, res: Response) {
    const t = await sequelize.transaction();
    try {
      const body = req.body as EncounterCreateBody;

      if (!body.appointment_id || !body.service_id) {
        await t.rollback();
        res.status(400).json({ error: "appointment_id and service_id are required" });
        return;
      }

      if (body.state !== undefined && body.state !== "in_progress" && body.state !== "completed") {
        await t.rollback();
        res.status(400).json({ error: "state on create must be 'in_progress' or 'completed'" });
        return;
      }

      const totalCheck = assertValidTotal(body.total ?? 0);
      if (!totalCheck.ok) {
        await t.rollback();
        res.status(totalCheck.status).json({ error: totalCheck.error });
        return;
      }

      // 1) Cita: activa y programada
      const appointment = await Appointment.findByPk(body.appointment_id, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (!appointment) {
        await t.rollback();
        res.status(404).json({ error: "Appointment not found" });
        return;
      }
      if (appointment.status !== "active") {
        await t.rollback();
        res.status(400).json({ error: "Appointment must be active" });
        return;
      }
      if (appointment.state !== "scheduled") {
        await t.rollback();
        res.status(400).json({
          error: `Appointment must be 'scheduled' (current: '${appointment.state}')`,
        });
        return;
      }

      const existing = await Encounter.findOne({
        where: { appointment_id: appointment.id },
        transaction: t,
      });
      if (existing) {
        await t.rollback();
        res.status(400).json({ error: "Appointment already has an encounter", id: existing.id });
        return;
      }

      // 2) Profesional: médico de la agenda activo
      const agenda = await Agenda.findByPk(appointment.agenda_id, { transaction: t });
      const doctor = agenda
        ? await Doctor.findByPk(agenda.doctor_id, { transaction: t })
        : null;
      if (!agenda || !doctor || doctor.status !== "active") {
        await t.rollback();
        res.status(400).json({ error: "Appointment doctor must exist and be active" });
        return;
      }

      // 3) Paciente activo
      const patient = await Patient.findByPk(appointment.patient_id, { transaction: t });
      if (!patient || patient.status !== "active") {
        await t.rollback();
        res.status(400).json({ error: "Appointment patient must exist and be active" });
        return;
      }

      // 4) Registro clínico: historia clínica activa del paciente
      const clinicalRecord = await ClinicalRecord.findOne({
        where: { patient_id: patient.id },
        transaction: t,
      });
      if (!clinicalRecord || clinicalRecord.status !== "active") {
        await t.rollback();
        res.status(400).json({ error: "Patient must have an active clinical record" });
        return;
      }

      // 5) Servicio activo
      const service = await Service.findByPk(body.service_id, { transaction: t });
      if (!service) {
        await t.rollback();
        res.status(404).json({ error: "Service not found" });
        return;
      }
      if (service.status !== "active") {
        await t.rollback();
        res.status(400).json({ error: "Service must be active" });
        return;
      }

      const start_date = body.start_date ?? appointment.start_date;
      const end_date = body.end_date ?? null;
      const rangeCheck = assertValidRange(start_date, end_date);
      if (!rangeCheck.ok) {
        await t.rollback();
        res.status(rangeCheck.status).json({ error: rangeCheck.error });
        return;
      }

      const encounter = await Encounter.create(
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
        { transaction: t }
      );

      await appointment.update({ state: "attended" }, { transaction: t });

      await t.commit();
      res.status(201).json({ encounter, appointment });
    } catch (error) {
      await t.rollback();
      res.status(500).json({ error: "Error creating encounter", detail: String(error) });
    }
  }

  // ================== UPDATE ==================
  /** PUT: reemplaza datos de la atención (las FKs no cambian). */
  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as EncounterEditableBody;
      const encounter = await Encounter.findByPk(id);
      if (!encounter) {
        res.status(404).json({ error: "Encounter not found" });
        return;
      }

      const total = body.total ?? 0;
      const totalCheck = assertValidTotal(total);
      if (!totalCheck.ok) {
        res.status(totalCheck.status).json({ error: totalCheck.error });
        return;
      }

      const start_date = body.start_date ?? encounter.start_date;
      const end_date = body.end_date ?? null;
      const rangeCheck = assertValidRange(start_date, end_date);
      if (!rangeCheck.ok) {
        res.status(rangeCheck.status).json({ error: rangeCheck.error });
        return;
      }

      await encounter.update({
        start_date,
        end_date,
        total: Number(total),
        state: body.state ?? encounter.state,
        observations: body.observations ?? null,
        status: body.status ?? encounter.status,
      });

      res.status(200).json({ encounter });
    } catch (error) {
      res.status(500).json({ error: "Error updating encounter (PUT)", detail: String(error) });
    }
  }

  /** PATCH: datos parciales de la atención (las FKs no cambian). */
  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as EncounterEditableBody;
      const encounter = await Encounter.findByPk(id);
      if (!encounter) {
        res.status(404).json({ error: "Encounter not found" });
        return;
      }

      if (body.total !== undefined) {
        const totalCheck = assertValidTotal(body.total);
        if (!totalCheck.ok) {
          res.status(totalCheck.status).json({ error: totalCheck.error });
          return;
        }
      }

      const rangeCheck = assertValidRange(
        body.start_date ?? encounter.start_date,
        body.end_date !== undefined ? body.end_date : encounter.end_date
      );
      if (!rangeCheck.ok) {
        res.status(rangeCheck.status).json({ error: rangeCheck.error });
        return;
      }

      const patch: EncounterEditableBody = {};
      if (body.start_date !== undefined) patch.start_date = body.start_date;
      if (body.end_date !== undefined) patch.end_date = body.end_date;
      if (body.total !== undefined) patch.total = Number(body.total);
      if (body.state !== undefined) patch.state = body.state;
      if (body.observations !== undefined) patch.observations = body.observations;
      if (body.status !== undefined) patch.status = body.status;

      await encounter.update(patch);
      res.status(200).json({ encounter });
    } catch (error) {
      res.status(500).json({ error: "Error updating encounter (PATCH)", detail: String(error) });
    }
  }

  // ================== DELETE ==================
  /** Eliminación física: borra la atención y la cita vuelve a "scheduled" (transacción). */
  public async deletePhysical(req: Request, res: Response) {
    const t = await sequelize.transaction();
    try {
      const id = paramId(req);
      const encounter = await Encounter.findByPk(id, { transaction: t });
      if (!encounter) {
        await t.rollback();
        res.status(404).json({ error: "Encounter not found" });
        return;
      }

      const appointment = await Appointment.findByPk(encounter.appointment_id, {
        transaction: t,
      });
      await encounter.destroy({ transaction: t });
      if (appointment && appointment.state === "attended") {
        await appointment.update({ state: "scheduled" }, { transaction: t });
      }

      await t.commit();
      res.status(200).json({ message: "Encounter permanently deleted", id });
    } catch (error) {
      await t.rollback();
      res.status(500).json({ error: "Error deleting encounter", detail: String(error) });
    }
  }

  /** Eliminación lógica → status = inactive */
  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const encounter = await Encounter.findByPk(id);
      if (!encounter) {
        res.status(404).json({ error: "Encounter not found" });
        return;
      }
      await encounter.update({ status: "inactive" });
      res.status(200).json({
        message: "Encounter deactivated (logical delete)",
        encounter,
      });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating encounter", detail: String(error) });
    }
  }
}
