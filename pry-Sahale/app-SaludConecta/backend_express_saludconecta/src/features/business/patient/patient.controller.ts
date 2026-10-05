import { Request, Response } from "express";
import { BaseController } from "../../../shared/http/base-controller";
import { CreatePatientDto, PatchPatientDto, UpdatePatientDto } from "./dto";
import { PatientService } from "./patient.service";

/**
 * Capa Controller del feature Patient.
 * Solo HTTP: lee `req`, llama al service y arma la respuesta.
 * El manejo de errores se delega en `run()` (ver `BaseController`).
 */
export class PatientController extends BaseController {
  public constructor(
    private readonly service: PatientService = new PatientService()
  ) {
    super();
  }

  // ================== READ ==================
  public async getAll(_req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const patients = await this.service.getAll();
      res.status(200).json({ patients });
    });
  }

  public async getOne(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const patient = await this.service.getOne(this.paramId(req));
      res.status(200).json({ patient });
    });
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const patient = await this.service.create(req.body as CreatePatientDto);
      res.status(201).json({ patient });
    });
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const patient = await this.service.updatePut(
        this.paramId(req),
        req.body as UpdatePatientDto
      );
      res.status(200).json({ patient });
    });
  }

  public async updatePatch(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const patient = await this.service.updatePatch(
        this.paramId(req),
        req.body as PatchPatientDto
      );
      res.status(200).json({ patient });
    });
  }

  // ================== DELETE ==================
  /** Eliminación física */
  public async deletePhysical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const id = this.paramId(req);
      await this.service.deletePhysical(id);
      res.status(200).json({ message: "Patient permanently deleted", id });
    });
  }

  /** Eliminación lógica → status = inactive */
  public async deleteLogical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const patient = await this.service.deleteLogical(this.paramId(req));
      res.status(200).json({ message: "Patient deactivated (logical delete)", patient });
    });
  }
}
