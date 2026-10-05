import { Request, Response } from "express";
import { BaseController } from "../../../shared/http/base-controller";
import { CreateDoctorDto, PatchDoctorDto, UpdateDoctorDto } from "./dto";
import { DoctorService } from "./doctor.service";

/**
 * Capa Controller del feature Doctor.
 * Solo HTTP: lee `req`, llama al service y arma la respuesta.
 * El manejo de errores se delega en `run()` (ver `BaseController`).
 */
export class DoctorController extends BaseController {
  public constructor(
    private readonly service: DoctorService = new DoctorService()
  ) {
    super();
  }

  // ================== READ ==================
  public async getAll(_req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const doctors = await this.service.getAll();
      res.status(200).json({ doctors });
    });
  }

  public async getOne(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const doctor = await this.service.getOne(this.paramId(req));
      res.status(200).json({ doctor });
    });
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const doctor = await this.service.create(req.body as CreateDoctorDto);
      res.status(201).json({ doctor });
    });
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const doctor = await this.service.updatePut(
        this.paramId(req),
        req.body as UpdateDoctorDto
      );
      res.status(200).json({ doctor });
    });
  }

  public async updatePatch(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const doctor = await this.service.updatePatch(
        this.paramId(req),
        req.body as PatchDoctorDto
      );
      res.status(200).json({ doctor });
    });
  }

  // ================== DELETE ==================
  /** Eliminación física */
  public async deletePhysical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const id = this.paramId(req);
      await this.service.deletePhysical(id);
      res.status(200).json({ message: "Doctor permanently deleted", id });
    });
  }

  /** Eliminación lógica → status = inactive */
  public async deleteLogical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const doctor = await this.service.deleteLogical(this.paramId(req));
      res.status(200).json({
        message: "Doctor deactivated (logical delete)",
        doctor,
      });
    });
  }
}
