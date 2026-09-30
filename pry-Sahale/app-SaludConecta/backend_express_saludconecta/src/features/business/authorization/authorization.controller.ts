import { Request, Response } from "express";
import { Authorization, AuthorizationI } from "./authorization.model";
import { Appointment } from "../appointment/appointment.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

type AuthorizationEditableBody = Partial<Pick<AuthorizationI, "name" | "description" | "status">>;

async function assertAuthorizableAppointment(
  appointment_id: number
): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  const appointment = await Appointment.findByPk(appointment_id);
  if (!appointment) {
    return { ok: false, status: 404, error: "Appointment not found" };
  }
  if (appointment.status !== "active") {
    return { ok: false, status: 400, error: "Appointment must be active" };
  }
  if (appointment.state === "cancelled") {
    return { ok: false, status: 400, error: "Cannot authorize a cancelled appointment" };
  }
  return { ok: true };
}

export class AuthorizationController {
  // ================== READ ==================
  public async getAll(req: Request, res: Response) {
    try {
      const authorizations = await Authorization.findAll({
        where: { status: "active" },
      });
      res.status(200).json({ authorizations });
    } catch (error) {
      res.status(500).json({ error: "Error fetching authorizations", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const authorization = await Authorization.findByPk(id);
      if (!authorization) {
        res.status(404).json({ error: "Authorization not found" });
        return;
      }
      res.status(200).json({ authorization });
    } catch (error) {
      res.status(500).json({ error: "Error fetching authorization", detail: String(error) });
    }
  }

  // ================== CREATE ==================
  /** Cita activa y no cancelada; máximo una autorización por cita (0..1:1). */
  public async create(req: Request, res: Response) {
    try {
      const body = req.body as AuthorizationI;

      if (!body.appointment_id) {
        res.status(400).json({ error: "appointment_id is required" });
        return;
      }

      const check = await assertAuthorizableAppointment(Number(body.appointment_id));
      if (!check.ok) {
        res.status(check.status).json({ error: check.error });
        return;
      }

      const existing = await Authorization.findOne({
        where: { appointment_id: body.appointment_id },
      });
      if (existing) {
        res.status(400).json({
          error: "Appointment already has an authorization",
          id: existing.id,
          status: existing.status,
        });
        return;
      }

      const authorization = await Authorization.create({
        name: body.name,
        description: body.description ?? null,
        appointment_id: body.appointment_id,
        status: body.status ?? "active",
      });
      res.status(201).json({ authorization });
    } catch (error) {
      res.status(500).json({ error: "Error creating authorization", detail: String(error) });
    }
  }

  // ================== UPDATE ==================
  /** PUT: reemplaza name, description y status (appointment_id no cambia). */
  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as AuthorizationEditableBody;
      const authorization = await Authorization.findByPk(id);
      if (!authorization) {
        res.status(404).json({ error: "Authorization not found" });
        return;
      }

      await authorization.update({
        name: body.name,
        description: body.description ?? null,
        status: body.status ?? authorization.status,
      });

      res.status(200).json({ authorization });
    } catch (error) {
      res.status(500).json({ error: "Error updating authorization (PUT)", detail: String(error) });
    }
  }

  /** PATCH: name, description y/o status (appointment_id no cambia). */
  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as AuthorizationEditableBody;
      const authorization = await Authorization.findByPk(id);
      if (!authorization) {
        res.status(404).json({ error: "Authorization not found" });
        return;
      }

      const patch: AuthorizationEditableBody = {};
      if (body.name !== undefined) patch.name = body.name;
      if (body.description !== undefined) patch.description = body.description;
      if (body.status !== undefined) patch.status = body.status;

      await authorization.update(patch);
      res.status(200).json({ authorization });
    } catch (error) {
      res.status(500).json({ error: "Error updating authorization (PATCH)", detail: String(error) });
    }
  }

  // ================== DELETE ==================
  /** Eliminación física */
  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const authorization = await Authorization.findByPk(id);
      if (!authorization) {
        res.status(404).json({ error: "Authorization not found" });
        return;
      }
      await authorization.destroy();
      res.status(200).json({ message: "Authorization permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting authorization", detail: String(error) });
    }
  }

  /** Eliminación lógica → status = inactive */
  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const authorization = await Authorization.findByPk(id);
      if (!authorization) {
        res.status(404).json({ error: "Authorization not found" });
        return;
      }
      await authorization.update({ status: "inactive" });
      res.status(200).json({
        message: "Authorization deactivated (logical delete)",
        authorization,
      });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating authorization", detail: String(error) });
    }
  }
}
