import { Request, Response } from "express";
import { Patient, PatientI } from "./patient.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

export class PatientController {
  // ================== READ ==================
    public async getAll(req: Request, res: Response) {
    try {
      const patients = await Patient.findAll({
        where: { status: "active" },
      });
      res.status(200).json({ patients });
    } catch (error) {
      res.status(500).json({ error: "Error fetching patients", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const patient = await Patient.findByPk(id);
      if (!patient) {
        res.status(404).json({ error: "Patient not found" });
        return;
      }
      res.status(200).json({ patient });
    } catch (error) {
      res.status(500).json({ error: "Error fetching patient", detail: String(error) });
    }
  }

  // ================== CREATE ==================
   public async create(req: Request, res: Response) {
    try {
      const body = req.body as PatientI;
      const patient = await Patient.create({
        document_type: body.document_type,
        document_number: body.document_number,
        name: body.name,
        birth_date: body.birth_date,
        contact: body.contact,
        status: body.status ?? "active",
      });
      res.status(201).json({ patient });
    } catch (error) {
      res.status(500).json({ error: "Error creating patient", detail: String(error) });
    }
  }

  // ================== UPDATE ==================
  // (rellenar en ISS-03-D)

  // ================== DELETE ==================
  // (rellenar en ISS-03-E)
}
