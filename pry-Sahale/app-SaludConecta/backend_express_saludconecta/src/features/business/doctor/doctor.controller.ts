import { Request, Response } from "express";
import { Doctor, DoctorI } from "./doctor.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

export class DoctorController {
  // ================== READ ==================
  public async getAll(req: Request, res: Response) {
    try {
      const doctors = await Doctor.findAll({
        where: { status: "active" },
      });
      res.status(200).json({ doctors });
    } catch (error) {
      res.status(500).json({ error: "Error fetching doctors", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const doctor = await Doctor.findByPk(id);
      if (!doctor) {
        res.status(404).json({ error: "Doctor not found" });
        return;
      }
      res.status(200).json({ doctor });
    } catch (error) {
      res.status(500).json({ error: "Error fetching doctor", detail: String(error) });
    }
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response) {
    try {
      const body = req.body as DoctorI;
      const doctor = await Doctor.create({
        name: body.name,
        description: body.description ?? null,
        status: body.status ?? "active",
      });
      res.status(201).json({ doctor });
    } catch (error) {
      res.status(500).json({ error: "Error creating doctor", detail: String(error) });
    }
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as DoctorI;
      const doctor = await Doctor.findByPk(id);
      if (!doctor) {
        res.status(404).json({ error: "Doctor not found" });
        return;
      }

      await doctor.update({
        name: body.name,
        description: body.description ?? null,
        status: body.status ?? doctor.status,
      });

      res.status(200).json({ doctor });
    } catch (error) {
      res.status(500).json({ error: "Error updating doctor (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<DoctorI>;
      const doctor = await Doctor.findByPk(id);
      if (!doctor) {
        res.status(404).json({ error: "Doctor not found" });
        return;
      }

      await doctor.update(body);
      res.status(200).json({ doctor });
    } catch (error) {
      res.status(500).json({ error: "Error updating doctor (PATCH)", detail: String(error) });
    }
  }

  // ================== DELETE ==================
  /** Eliminación física */
  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const doctor = await Doctor.findByPk(id);
      if (!doctor) {
        res.status(404).json({ error: "Doctor not found" });
        return;
      }
      await doctor.destroy();
      res.status(200).json({ message: "Doctor permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting doctor", detail: String(error) });
    }
  }

  /** Eliminación lógica → status = inactive */
  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const doctor = await Doctor.findByPk(id);
      if (!doctor) {
        res.status(404).json({ error: "Doctor not found" });
        return;
      }
      await doctor.update({ status: "inactive" });
      res.status(200).json({
        message: "Doctor deactivated (logical delete)",
        doctor,
      });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating doctor", detail: String(error) });
    }
  }
}
