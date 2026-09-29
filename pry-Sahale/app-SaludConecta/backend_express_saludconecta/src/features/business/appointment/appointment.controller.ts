import { Request, Response } from "express";
import { Op, Transaction } from "sequelize";
import { sequelize } from "../../../database/db";
import { Appointment, AppointmentI, AppointmentState } from "./appointment.model";
import { Agenda } from "../agenda/agenda.model";
import { Doctor } from "../doctor/doctor.model";
import { Patient } from "../patient/patient.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

type Check = { ok: true } | { ok: false; status: number; error: string };

type AppointmentCreateBody = {
  agenda_id: number;
  patient_id: number;
  start_date: Date | string;
  end_date: Date | string;
  reason?: string | null;
  status?: "active" | "inactive";
};

/** Agenda activa (con médico activo) y paciente activo. */
async function assertActiveParents(
  agenda_id: number,
  patient_id: number,
  t?: Transaction
): Promise<Check> {
  const agenda = await Agenda.findByPk(agenda_id, {
    transaction: t,
    lock: t ? t.LOCK.UPDATE : undefined,
  });
  if (!agenda) {
    return { ok: false, status: 404, error: "Agenda not found" };
  }
  if (agenda.status !== "active") {
    return { ok: false, status: 400, error: "Agenda must be active" };
  }

  const doctor = await Doctor.findByPk(agenda.doctor_id, { transaction: t });
  if (!doctor || doctor.status !== "active") {
    return { ok: false, status: 400, error: "Agenda doctor must be active" };
  }

  const patient = await Patient.findByPk(patient_id, { transaction: t });
  if (!patient) {
    return { ok: false, status: 404, error: "Patient not found" };
  }
  if (patient.status !== "active") {
    return { ok: false, status: 400, error: "Patient must be active" };
  }

  return { ok: true };
}

function assertValidRange(start: Date | string, end: Date | string): Check {
  const s = new Date(start);
  const e = new Date(end);
  if (isNaN(s.getTime()) || isNaN(e.getTime())) {
    return { ok: false, status: 400, error: "start_date and end_date must be valid dates" };
  }
  if (e.getTime() <= s.getTime()) {
    return { ok: false, status: 400, error: "end_date must be after start_date" };
  }
  return { ok: true };
}

/** Sin cruce de horario con otra cita activa (no cancelada) de la misma agenda. */
async function assertNoOverlap(
  agenda_id: number,
  start: Date | string,
  end: Date | string,
  excludeId: number | null,
  t?: Transaction
): Promise<Check> {
  const where: Record<string | symbol, unknown> = {
    agenda_id,
    status: "active",
    state: { [Op.ne]: "cancelled" },
    start_date: { [Op.lt]: new Date(end) },
    end_date: { [Op.gt]: new Date(start) },
  };
  if (excludeId !== null) {
    where.id = { [Op.ne]: excludeId };
  }

  const overlap = await Appointment.findOne({ where, transaction: t });
  if (overlap) {
    return {
      ok: false,
      status: 400,
      error: `Agenda already has an appointment in that time range (id ${overlap.id})`,
    };
  }
  return { ok: true };
}

/** Regla del PDF: solo POST /api/encounters pasa una cita a "attended". */
function assertStateChange(current: AppointmentState, next: AppointmentState): Check {
  if (next === current) {
    return { ok: true };
  }
  if (next === "attended") {
    return {
      ok: false,
      status: 400,
      error: "State 'attended' is set only by POST /api/encounters (requires clinical record)",
    };
  }
  if (current === "attended") {
    return { ok: false, status: 400, error: "An attended appointment cannot change its state" };
  }
  return { ok: true };
}

/** Valida los cambios de PUT/PATCH con los valores finales (body ?? actuales). */
async function validateChanges(
  appointment: Appointment,
  body: Partial<AppointmentI>
): Promise<Check> {
  const nextState = (body.state ?? appointment.state) as AppointmentState;
  const stateCheck = assertStateChange(appointment.state, nextState);
  if (!stateCheck.ok) {
    return stateCheck;
  }

  const agenda_id = Number(body.agenda_id ?? appointment.agenda_id);
  const patient_id = Number(body.patient_id ?? appointment.patient_id);
  const start = body.start_date ?? appointment.start_date;
  const end = body.end_date ?? appointment.end_date;

  const rangeCheck = assertValidRange(start, end);
  if (!rangeCheck.ok) {
    return rangeCheck;
  }

  if (body.agenda_id !== undefined || body.patient_id !== undefined) {
    const parentsCheck = await assertActiveParents(agenda_id, patient_id);
    if (!parentsCheck.ok) {
      return parentsCheck;
    }
  }

  if (nextState !== "cancelled") {
    const overlapCheck = await assertNoOverlap(agenda_id, start, end, appointment.id);
    if (!overlapCheck.ok) {
      return overlapCheck;
    }
  }

  return { ok: true };
}

export class AppointmentController {
  // ================== READ ==================
  public async getAll(req: Request, res: Response) {
    try {
      const appointments = await Appointment.findAll({
        where: { status: "active" },
        include: [
          { model: Agenda, as: "agenda" },
          { model: Patient, as: "patient" },
        ],
      });
      res.status(200).json({ appointments });
    } catch (error) {
      res.status(500).json({ error: "Error fetching appointments", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const appointment = await Appointment.findByPk(id, {
        include: [
          { model: Agenda, as: "agenda" },
          { model: Patient, as: "patient" },
        ],
      });
      if (!appointment) {
        res.status(404).json({ error: "Appointment not found" });
        return;
      }
      res.status(200).json({ appointment });
    } catch (error) {
      res.status(500).json({ error: "Error fetching appointment", detail: String(error) });
    }
  }

  // ================== CREATE ==================
  /** Transaccional: agenda y médico activos, paciente activo, rango válido, sin cruce. */
  public async create(req: Request, res: Response) {
    const t = await sequelize.transaction();
    try {
      const body = req.body as AppointmentCreateBody;

      if (!body.agenda_id || !body.patient_id || !body.start_date || !body.end_date) {
        await t.rollback();
        res.status(400).json({
          error: "agenda_id, patient_id, start_date and end_date are required",
        });
        return;
      }

      const rangeCheck = assertValidRange(body.start_date, body.end_date);
      if (!rangeCheck.ok) {
        await t.rollback();
        res.status(rangeCheck.status).json({ error: rangeCheck.error });
        return;
      }

      const parentsCheck = await assertActiveParents(
        Number(body.agenda_id),
        Number(body.patient_id),
        t
      );
      if (!parentsCheck.ok) {
        await t.rollback();
        res.status(parentsCheck.status).json({ error: parentsCheck.error });
        return;
      }

      const overlapCheck = await assertNoOverlap(
        Number(body.agenda_id),
        body.start_date,
        body.end_date,
        null,
        t
      );
      if (!overlapCheck.ok) {
        await t.rollback();
        res.status(overlapCheck.status).json({ error: overlapCheck.error });
        return;
      }

      const appointment = await Appointment.create(
        {
          start_date: body.start_date,
          end_date: body.end_date,
          reason: body.reason ?? null,
          state: "scheduled",
          agenda_id: body.agenda_id,
          patient_id: body.patient_id,
          status: body.status ?? "active",
        },
        { transaction: t }
      );

      await t.commit();
      res.status(201).json({ appointment });
    } catch (error) {
      await t.rollback();
      res.status(500).json({ error: "Error creating appointment", detail: String(error) });
    }
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<AppointmentI>;
      const appointment = await Appointment.findByPk(id);
      if (!appointment) {
        res.status(404).json({ error: "Appointment not found" });
        return;
      }

      const check = await validateChanges(appointment, body);
      if (!check.ok) {
        res.status(check.status).json({ error: check.error });
        return;
      }

      await appointment.update({
        start_date: body.start_date ?? appointment.start_date,
        end_date: body.end_date ?? appointment.end_date,
        reason: body.reason ?? null,
        state: body.state ?? appointment.state,
        agenda_id: body.agenda_id ?? appointment.agenda_id,
        patient_id: body.patient_id ?? appointment.patient_id,
        status: body.status ?? appointment.status,
      });

      res.status(200).json({ appointment });
    } catch (error) {
      res.status(500).json({ error: "Error updating appointment (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<AppointmentI>;
      const appointment = await Appointment.findByPk(id);
      if (!appointment) {
        res.status(404).json({ error: "Appointment not found" });
        return;
      }

      const check = await validateChanges(appointment, body);
      if (!check.ok) {
        res.status(check.status).json({ error: check.error });
        return;
      }

      const patch: Partial<AppointmentI> = {};
      if (body.start_date !== undefined) patch.start_date = body.start_date;
      if (body.end_date !== undefined) patch.end_date = body.end_date;
      if (body.reason !== undefined) patch.reason = body.reason;
      if (body.state !== undefined) patch.state = body.state;
      if (body.agenda_id !== undefined) patch.agenda_id = body.agenda_id;
      if (body.patient_id !== undefined) patch.patient_id = body.patient_id;
      if (body.status !== undefined) patch.status = body.status;

      await appointment.update(patch);
      res.status(200).json({ appointment });
    } catch (error) {
      res.status(500).json({ error: "Error updating appointment (PATCH)", detail: String(error) });
    }
  }

  // ================== DELETE ==================
  /** Eliminación física */
  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const appointment = await Appointment.findByPk(id);
      if (!appointment) {
        res.status(404).json({ error: "Appointment not found" });
        return;
      }
      await appointment.destroy();
      res.status(200).json({ message: "Appointment permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting appointment", detail: String(error) });
    }
  }

  /** Eliminación lógica → status = inactive */
  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const appointment = await Appointment.findByPk(id);
      if (!appointment) {
        res.status(404).json({ error: "Appointment not found" });
        return;
      }
      await appointment.update({ status: "inactive" });
      res.status(200).json({
        message: "Appointment deactivated (logical delete)",
        appointment,
      });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating appointment", detail: String(error) });
    }
  }
}
