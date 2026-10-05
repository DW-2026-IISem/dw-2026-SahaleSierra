import { Request, Response } from "express";
import { BaseController } from "../../../shared/http/base-controller";
import { AppError } from "../../../shared/errors/app-error";
import { CreateClinicalRecordDto, PatchClinicalRecordDto, UpdateClinicalRecordDto } from "./dto";
import { ClinicalRecordService } from "./clinical-record.service";

/**
 * Capa Controller del feature ClinicalRecord.
 * Solo HTTP: lee `req`, llama al service y arma la respuesta.
 * El manejo de errores se delega en `run()` (ver `BaseController`).
 */
export class ClinicalRecordController extends BaseController {
  public constructor(
    private readonly service: ClinicalRecordService = new ClinicalRecordService()
  ) {
    super();
  }

  // ================== READ ==================
  public async getAll(_req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const clinical_records = await this.service.getAll();
      res.status(200).json({ clinical_records });
    });
  }

  public async getOne(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const clinical_record = await this.service.getOne(this.paramId(req));
      res.status(200).json({ clinical_record });
    });
  }

  /** PDF: GET /historias/:pacienteId → historia clínica de un paciente (1:1). */
  public async getByPatient(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const clinical_record = await this.service.getByPatient(this.paramPatientId(req));
      res.status(200).json({ clinical_record });
    });
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const clinical_record = await this.service.create(req.body as CreateClinicalRecordDto);
      res.status(201).json({ clinical_record });
    });
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const clinical_record = await this.service.updatePut(
        this.paramId(req),
        req.body as UpdateClinicalRecordDto
      );
      res.status(200).json({ clinical_record });
    });
  }

  public async updatePatch(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const clinical_record = await this.service.updatePatch(
        this.paramId(req),
        req.body as PatchClinicalRecordDto
      );
      res.status(200).json({ clinical_record });
    });
  }

  // ================== DELETE ==================
  /** Eliminación física */
  public async deletePhysical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const id = this.paramId(req);
      await this.service.deletePhysical(id);
      res.status(200).json({ message: "Clinical record permanently deleted", id });
    });
  }

  /** Eliminación lógica → status = inactive */
  public async deleteLogical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const clinical_record = await this.service.deleteLogical(this.paramId(req));
      res.status(200).json({
        message: "Clinical record deactivated (logical delete)",
        clinical_record,
      });
    });
  }

  // ================== HELPERS ==================
  /** Lee y valida `:patientId` (misma regla que `paramId` para `:id`). */
  private paramPatientId(req: Request): number {
    const raw = req.params.patientId;
    const value = Array.isArray(raw) ? raw[0] : raw;

    if (!value || !/^\d+$/.test(value) || Number(value) < 1) {
      throw new AppError(400, "Invalid patientId: must be a positive integer");
    }
    return Number(value);
  }
}
