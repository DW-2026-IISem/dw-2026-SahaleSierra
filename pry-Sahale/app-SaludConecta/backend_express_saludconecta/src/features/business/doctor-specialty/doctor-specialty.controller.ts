import { Request, Response } from "express";
import { BaseController } from "../../../shared/http/base-controller";
import { CreateDoctorSpecialtyDto, PatchDoctorSpecialtyDto, UpdateDoctorSpecialtyDto } from "./dto";
import { DoctorSpecialtyService } from "./doctor-specialty.service";

/**
 * Capa Controller del feature DoctorSpecialty.
 * Solo HTTP: lee `req`, llama al service y arma la respuesta.
 * El manejo de errores se delega en `run()` (ver `BaseController`).
 */
export class DoctorSpecialtyController extends BaseController {
  public constructor(
    private readonly service: DoctorSpecialtyService = new DoctorSpecialtyService()
  ) {
    super();
  }

  // ================== READ ==================
  public async getAll(_req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const doctor_specialties = await this.service.getAll();
      res.status(200).json({ doctor_specialties });
    });
  }

  public async getOne(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const doctor_specialty = await this.service.getOne(this.paramId(req));
      res.status(200).json({ doctor_specialty });
    });
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const doctor_specialty = await this.service.create(req.body as CreateDoctorSpecialtyDto);
      res.status(201).json({ doctor_specialty });
    });
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const doctor_specialty = await this.service.updatePut(
        this.paramId(req),
        req.body as UpdateDoctorSpecialtyDto
      );
      res.status(200).json({ doctor_specialty });
    });
  }

  public async updatePatch(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const doctor_specialty = await this.service.updatePatch(
        this.paramId(req),
        req.body as PatchDoctorSpecialtyDto
      );
      res.status(200).json({ doctor_specialty });
    });
  }

  // ================== DELETE ==================
  /** Eliminación física */
  public async deletePhysical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const id = this.paramId(req);
      await this.service.deletePhysical(id);
      res.status(200).json({ message: "Doctor specialty permanently deleted", id });
    });
  }

  /** Eliminación lógica → status = inactive */
  public async deleteLogical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const doctor_specialty = await this.service.deleteLogical(this.paramId(req));
      res.status(200).json({
        message: "Doctor specialty deactivated (logical delete)",
        doctor_specialty,
      });
    });
  }
}
