import { Request, Response } from "express";
import { Service, ServiceI } from "./service.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

export class ServiceController {
  // ================== READ ==================
  public async getAll(req: Request, res: Response) {
    try {
      const services = await Service.findAll({
        where: { status: "active" },
      });
      res.status(200).json({ services });
    } catch (error) {
      res.status(500).json({ error: "Error fetching services", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const service = await Service.findByPk(id);
      if (!service) {
        res.status(404).json({ error: "Service not found" });
        return;
      }
      res.status(200).json({ service });
    } catch (error) {
      res.status(500).json({ error: "Error fetching service", detail: String(error) });
    }
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response) {
    try {
      const body = req.body as ServiceI;
      const service = await Service.create({
        name: body.name,
        description: body.description ?? null,
        status: body.status ?? "active",
      });
      res.status(201).json({ service });
    } catch (error) {
      res.status(500).json({ error: "Error creating service", detail: String(error) });
    }
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as ServiceI;
      const service = await Service.findByPk(id);
      if (!service) {
        res.status(404).json({ error: "Service not found" });
        return;
      }

      await service.update({
        name: body.name,
        description: body.description ?? null,
        status: body.status ?? service.status,
      });

      res.status(200).json({ service });
    } catch (error) {
      res.status(500).json({ error: "Error updating service (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<ServiceI>;
      const service = await Service.findByPk(id);
      if (!service) {
        res.status(404).json({ error: "Service not found" });
        return;
      }

      await service.update(body);
      res.status(200).json({ service });
    } catch (error) {
      res.status(500).json({ error: "Error updating service (PATCH)", detail: String(error) });
    }
  }

  // ================== DELETE ==================
  /** Eliminación física */
  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const service = await Service.findByPk(id);
      if (!service) {
        res.status(404).json({ error: "Service not found" });
        return;
      }
      await service.destroy();
      res.status(200).json({ message: "Service permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting service", detail: String(error) });
    }
  }

  /** Eliminación lógica → status = inactive */
  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const service = await Service.findByPk(id);
      if (!service) {
        res.status(404).json({ error: "Service not found" });
        return;
      }
      await service.update({ status: "inactive" });
      res.status(200).json({
        message: "Service deactivated (logical delete)",
        service,
      });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating service", detail: String(error) });
    }
  }
}
