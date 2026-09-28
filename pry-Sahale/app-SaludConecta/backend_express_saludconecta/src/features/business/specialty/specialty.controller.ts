import { Request, Response } from "express";
import { Specialty, SpecialtyI } from "./specialty.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

export class SpecialtyController {
  // ================== READ ==================
  public async getAll(req: Request, res: Response) {
    try {
      const specialties = await Specialty.findAll({
        where: { status: "active" },
      });
      res.status(200).json({ specialties });
    } catch (error) {
      res.status(500).json({ error: "Error fetching specialties", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const specialty = await Specialty.findByPk(id);
      if (!specialty) {
        res.status(404).json({ error: "Specialty not found" });
        return;
      }
      res.status(200).json({ specialty });
    } catch (error) {
      res.status(500).json({ error: "Error fetching specialty", detail: String(error) });
    }
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response) {
    try {
      const body = req.body as SpecialtyI;
      const specialty = await Specialty.create({
        name: body.name,
        description: body.description ?? null,
        status: body.status ?? "active",
      });
      res.status(201).json({ specialty });
    } catch (error) {
      res.status(500).json({ error: "Error creating specialty", detail: String(error) });
    }
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as SpecialtyI;
      const specialty = await Specialty.findByPk(id);
      if (!specialty) {
        res.status(404).json({ error: "Specialty not found" });
        return;
      }

      await specialty.update({
        name: body.name,
        description: body.description ?? null,
        status: body.status ?? specialty.status,
      });

      res.status(200).json({ specialty });
    } catch (error) {
      res.status(500).json({ error: "Error updating specialty (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<SpecialtyI>;
      const specialty = await Specialty.findByPk(id);
      if (!specialty) {
        res.status(404).json({ error: "Specialty not found" });
        return;
      }

      await specialty.update(body);
      res.status(200).json({ specialty });
    } catch (error) {
      res.status(500).json({ error: "Error updating specialty (PATCH)", detail: String(error) });
    }
  }

  // ================== DELETE ==================
  /** Eliminación física */
  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const specialty = await Specialty.findByPk(id);
      if (!specialty) {
        res.status(404).json({ error: "Specialty not found" });
        return;
      }
      await specialty.destroy();
      res.status(200).json({ message: "Specialty permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting specialty", detail: String(error) });
    }
  }

  /** Eliminación lógica → status = inactive */
  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const specialty = await Specialty.findByPk(id);
      if (!specialty) {
        res.status(404).json({ error: "Specialty not found" });
        return;
      }
      await specialty.update({ status: "inactive" });
      res.status(200).json({
        message: "Specialty deactivated (logical delete)",
        specialty,
      });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating specialty", detail: String(error) });
    }
  }
}
