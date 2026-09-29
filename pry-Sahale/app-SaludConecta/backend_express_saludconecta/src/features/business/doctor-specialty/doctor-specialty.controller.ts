import { Request, Response } from "express";
import { DoctorSpecialty, DoctorSpecialtyI } from "./doctor-specialty.model";
import { Doctor } from "../doctor/doctor.model";
import { Specialty } from "../specialty/specialty.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

type ParentCheck = { ok: true } | { ok: false; status: number; error: string };
type DoctorSpecialtyCreateBody = Pick<DoctorSpecialtyI, "doctor_id" | "specialty_id" | "relation_data" | "status">;

async function assertActiveParents(doctor_id: number, specialty_id: number): Promise<ParentCheck> {
  const doctor = await Doctor.findByPk(doctor_id);
  if (!doctor) {
    return { ok: false, status: 404, error: "Doctor not found" };
  }
  if (doctor.status !== "active") {
    return { ok: false, status: 400, error: "Doctor must be active" };
  }

  const specialty = await Specialty.findByPk(specialty_id);
  if (!specialty) {
    return { ok: false, status: 404, error: "Specialty not found" };
  }
  if (specialty.status !== "active") {
    return { ok: false, status: 400, error: "Specialty must be active" };
  }

  return { ok: true };
}

export class DoctorSpecialtyController {
  // ================== READ ==================
  public async getAll(req: Request, res: Response) {
    try {
      const doctor_specialties = await DoctorSpecialty.findAll({
        where: { status: "active" },
      });
      res.status(200).json({ doctor_specialties });
    } catch (error) {
      res.status(500).json({ error: "Error fetching doctor specialties", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const doctor_specialty = await DoctorSpecialty.findByPk(id);
      if (!doctor_specialty) {
        res.status(404).json({ error: "Doctor specialty not found" });
        return;
      }
      res.status(200).json({ doctor_specialty });
    } catch (error) {
      res.status(500).json({ error: "Error fetching doctor specialty", detail: String(error) });
    }
  }

  // ================== CREATE ==================
  /** Asigna una especialidad a un médico (ambos activos, par no repetido). */
  public async create(req: Request, res: Response) {
    try {
          const body = req.body as DoctorSpecialtyCreateBody;

      if (!body.doctor_id || !body.specialty_id) {
        res.status(400).json({ error: "doctor_id and specialty_id are required" });
        return;
      }

      const check = await assertActiveParents(Number(body.doctor_id), Number(body.specialty_id));
      if (!check.ok) {
        res.status(check.status).json({ error: check.error });
        return;
      }

      const existing = await DoctorSpecialty.findOne({
        where: { doctor_id: body.doctor_id, specialty_id: body.specialty_id },
      });
      if (existing) {
        res.status(400).json({
          error: "Doctor already has this specialty",
          id: existing.id,
          status: existing.status,
        });
        return;
      }

      const doctor_specialty = await DoctorSpecialty.create({
        doctor_id: body.doctor_id,
        specialty_id: body.specialty_id,
        relation_data: body.relation_data ?? null,
        status: body.status ?? "active",
      });
      res.status(201).json({ doctor_specialty });
    } catch (error) {
      res.status(500).json({ error: "Error creating doctor specialty", detail: String(error) });
    }
  }

  // ================== UPDATE ==================
  /** PUT: reemplaza relation_data y status (el par doctor/specialty no cambia). */
  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Pick<DoctorSpecialtyI, "relation_data" | "status">;
      const doctor_specialty = await DoctorSpecialty.findByPk(id);
      if (!doctor_specialty) {
        res.status(404).json({ error: "Doctor specialty not found" });
        return;
      }

      const nextStatus = body.status ?? doctor_specialty.status;
      if (nextStatus === "active") {
        const check = await assertActiveParents(
          doctor_specialty.doctor_id,
          doctor_specialty.specialty_id
        );
        if (!check.ok) {
          res.status(check.status).json({ error: check.error });
          return;
        }
      }

      await doctor_specialty.update({
        relation_data: body.relation_data ?? null,
        status: nextStatus,
      });

      res.status(200).json({ doctor_specialty });
    } catch (error) {
      res.status(500).json({ error: "Error updating doctor specialty (PUT)", detail: String(error) });
    }
  }

  /** PATCH: relation_data y/o status (el par doctor/specialty no cambia). */
  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<Pick<DoctorSpecialtyI, "relation_data" | "status">>;
      const doctor_specialty = await DoctorSpecialty.findByPk(id);
      if (!doctor_specialty) {
        res.status(404).json({ error: "Doctor specialty not found" });
        return;
      }

      if (body.status === "active") {
        const check = await assertActiveParents(
          doctor_specialty.doctor_id,
          doctor_specialty.specialty_id
        );
        if (!check.ok) {
          res.status(check.status).json({ error: check.error });
          return;
        }
      }

      const patch: Partial<Pick<DoctorSpecialtyI, "relation_data" | "status">> = {};
      if (body.relation_data !== undefined) {
        patch.relation_data = body.relation_data;
      }
      if (body.status !== undefined) {
        patch.status = body.status;
      }

      await doctor_specialty.update(patch);
      res.status(200).json({ doctor_specialty });
    } catch (error) {
      res.status(500).json({ error: "Error updating doctor specialty (PATCH)", detail: String(error) });
    }
  }

  // ================== DELETE ==================
  /** Eliminación física */
  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const doctor_specialty = await DoctorSpecialty.findByPk(id);
      if (!doctor_specialty) {
        res.status(404).json({ error: "Doctor specialty not found" });
        return;
      }
      await doctor_specialty.destroy();
      res.status(200).json({ message: "Doctor specialty permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting doctor specialty", detail: String(error) });
    }
  }

  /** Eliminación lógica → status = inactive */
  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const doctor_specialty = await DoctorSpecialty.findByPk(id);
      if (!doctor_specialty) {
        res.status(404).json({ error: "Doctor specialty not found" });
        return;
      }
      await doctor_specialty.update({ status: "inactive" });
      res.status(200).json({
        message: "Doctor specialty deactivated (logical delete)",
        doctor_specialty,
      });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating doctor specialty", detail: String(error) });
    }
  }
}
