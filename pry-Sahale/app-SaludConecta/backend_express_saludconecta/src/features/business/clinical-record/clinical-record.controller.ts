import { Request, Response } from "express";
import { ClinicalRecord, ClinicalRecordI } from "./clinical-record.model";
import { Patient } from "../patient/patient.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

function paramPatientId(req: Request): number {
  const raw = req.params.patientId;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

type ClinicalRecordEditableBody = Partial<Pick<ClinicalRecordI, "name" | "description" | "status">>;

export class ClinicalRecordController {
  // ================== READ ==================
  public async getAll(req: Request, res: Response) {
    try {
      const clinical_records = await ClinicalRecord.findAll({
        where: { status: "active" },
      });
      res.status(200).json({ clinical_records });
    } catch (error) {
      res.status(500).json({ error: "Error fetching clinical records", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const clinical_record = await ClinicalRecord.findByPk(id);
      if (!clinical_record) {
        res.status(404).json({ error: "Clinical record not found" });
        return;
      }
      res.status(200).json({ clinical_record });
    } catch (error) {
      res.status(500).json({ error: "Error fetching clinical record", detail: String(error) });
    }
  }

  /** PDF: GET /historias/:pacienteId → historia clínica de un paciente (1:1). */
  public async getByPatient(req: Request, res: Response) {
    try {
      const patientId = paramPatientId(req);
      const clinical_record = await ClinicalRecord.findOne({
        where: { patient_id: patientId },
      });
      if (!clinical_record) {
        res.status(404).json({ error: "Clinical record not found for this patient" });
        return;
      }
      res.status(200).json({ clinical_record });
    } catch (error) {
      res.status(500).json({ error: "Error fetching clinical record", detail: String(error) });
    }
  }

  // ================== CREATE ==================
  /** Paciente activo y sin historia previa (1:1). */
  public async create(req: Request, res: Response) {
    try {
      const body = req.body as ClinicalRecordI;

      if (!body.patient_id) {
        res.status(400).json({ error: "patient_id is required" });
        return;
      }

      const patient = await Patient.findByPk(body.patient_id);
      if (!patient) {
        res.status(404).json({ error: "Patient not found" });
        return;
      }
      if (patient.status !== "active") {
        res.status(400).json({ error: "Patient must be active" });
        return;
      }

      const existing = await ClinicalRecord.findOne({
        where: { patient_id: body.patient_id },
      });
      if (existing) {
        res.status(400).json({
          error: "Patient already has a clinical record",
          id: existing.id,
          status: existing.status,
        });
        return;
      }

      const clinical_record = await ClinicalRecord.create({
        name: body.name,
        description: body.description ?? null,
        patient_id: body.patient_id,
        status: body.status ?? "active",
      });
      res.status(201).json({ clinical_record });
    } catch (error) {
      res.status(500).json({ error: "Error creating clinical record", detail: String(error) });
    }
  }

  // ================== UPDATE ==================
  /** PUT: reemplaza name, description y status (patient_id no cambia). */
  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as ClinicalRecordEditableBody;
      const clinical_record = await ClinicalRecord.findByPk(id);
      if (!clinical_record) {
        res.status(404).json({ error: "Clinical record not found" });
        return;
      }

      await clinical_record.update({
        name: body.name,
        description: body.description ?? null,
        status: body.status ?? clinical_record.status,
      });

      res.status(200).json({ clinical_record });
    } catch (error) {
      res.status(500).json({ error: "Error updating clinical record (PUT)", detail: String(error) });
    }
  }

  /** PATCH: name, description y/o status (patient_id no cambia). */
  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as ClinicalRecordEditableBody;
      const clinical_record = await ClinicalRecord.findByPk(id);
      if (!clinical_record) {
        res.status(404).json({ error: "Clinical record not found" });
        return;
      }

      const patch: ClinicalRecordEditableBody = {};
      if (body.name !== undefined) patch.name = body.name;
      if (body.description !== undefined) patch.description = body.description;
      if (body.status !== undefined) patch.status = body.status;

      await clinical_record.update(patch);
      res.status(200).json({ clinical_record });
    } catch (error) {
      res.status(500).json({ error: "Error updating clinical record (PATCH)", detail: String(error) });
    }
  }

  // ================== DELETE ==================
  /** Eliminación física */
  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const clinical_record = await ClinicalRecord.findByPk(id);
      if (!clinical_record) {
        res.status(404).json({ error: "Clinical record not found" });
        return;
      }
      await clinical_record.destroy();
      res.status(200).json({ message: "Clinical record permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting clinical record", detail: String(error) });
    }
  }

  /** Eliminación lógica → status = inactive */
  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const clinical_record = await ClinicalRecord.findByPk(id);
      if (!clinical_record) {
        res.status(404).json({ error: "Clinical record not found" });
        return;
      }
      await clinical_record.update({ status: "inactive" });
      res.status(200).json({
        message: "Clinical record deactivated (logical delete)",
        clinical_record,
      });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating clinical record", detail: String(error) });
    }
  }
}
