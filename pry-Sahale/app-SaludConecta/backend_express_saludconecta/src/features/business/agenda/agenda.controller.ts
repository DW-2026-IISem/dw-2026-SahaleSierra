import { Request, Response } from "express";
import { Agenda, AgendaI } from "./agenda.model";
import { Doctor } from "../doctor/doctor.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

async function assertActiveDoctor(doctor_id: number): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  const doctor = await Doctor.findByPk(doctor_id);
  if (!doctor) {
    return { ok: false, status: 404, error: "Doctor not found" };
  }
  if (doctor.status !== "active") {
    return { ok: false, status: 400, error: "Doctor must be active" };
  }
  return { ok: true };
}

export class AgendaController {
  // ================== READ ==================
  public async getAll(req: Request, res: Response) {
    try {
      const agendas = await Agenda.findAll({
        where: { status: "active" },
      });
      res.status(200).json({ agendas });
    } catch (error) {
      res.status(500).json({ error: "Error fetching agendas", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const agenda = await Agenda.findByPk(id);
      if (!agenda) {
        res.status(404).json({ error: "Agenda not found" });
        return;
      }
      res.status(200).json({ agenda });
    } catch (error) {
      res.status(500).json({ error: "Error fetching agenda", detail: String(error) });
    }
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response) {
    try {
      const body = req.body as AgendaI;
      const check = await assertActiveDoctor(Number(body.doctor_id));
      if (!check.ok) {
        res.status(check.status).json({ error: check.error });
        return;
      }

      const agenda = await Agenda.create({
        name: body.name,
        description: body.description ?? null,
        doctor_id: body.doctor_id,
        status: body.status ?? "active",
      });
      res.status(201).json({ agenda });
    } catch (error) {
      res.status(500).json({ error: "Error creating agenda", detail: String(error) });
    }
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as AgendaI;
      const agenda = await Agenda.findByPk(id);
      if (!agenda) {
        res.status(404).json({ error: "Agenda not found" });
        return;
      }

      const check = await assertActiveDoctor(Number(body.doctor_id));
      if (!check.ok) {
        res.status(check.status).json({ error: check.error });
        return;
      }

      await agenda.update({
        name: body.name,
        description: body.description ?? null,
        doctor_id: body.doctor_id,
        status: body.status ?? agenda.status,
      });

      res.status(200).json({ agenda });
    } catch (error) {
      res.status(500).json({ error: "Error updating agenda (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<AgendaI>;
      const agenda = await Agenda.findByPk(id);
      if (!agenda) {
        res.status(404).json({ error: "Agenda not found" });
        return;
      }

      if (body.doctor_id !== undefined) {
        const check = await assertActiveDoctor(Number(body.doctor_id));
        if (!check.ok) {
          res.status(check.status).json({ error: check.error });
          return;
        }
      }

      await agenda.update(body);
      res.status(200).json({ agenda });
    } catch (error) {
      res.status(500).json({ error: "Error updating agenda (PATCH)", detail: String(error) });
    }
  }

  // ================== DELETE ==================
  /** Eliminación física */
  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const agenda = await Agenda.findByPk(id);
      if (!agenda) {
        res.status(404).json({ error: "Agenda not found" });
        return;
      }
      await agenda.destroy();
      res.status(200).json({ message: "Agenda permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting agenda", detail: String(error) });
    }
  }

  /** Eliminación lógica → status = inactive */
  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const agenda = await Agenda.findByPk(id);
      if (!agenda) {
        res.status(404).json({ error: "Agenda not found" });
        return;
      }
      await agenda.update({ status: "inactive" });
      res.status(200).json({
        message: "Agenda deactivated (logical delete)",
        agenda,
      });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating agenda", detail: String(error) });
    }
  }
}
