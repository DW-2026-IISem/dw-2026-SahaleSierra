import { Request, Response } from "express";
import { BaseController } from "../../../shared/http/base-controller";
import { CreateAppointmentDto, PatchAppointmentDto, UpdateAppointmentDto } from "./dto";
import { AppointmentService } from "./appointment.service";

/**
 * Capa Controller del feature Appointment.
 * Solo HTTP: lee `req`, llama al service y arma la respuesta.
 * El manejo de errores se delega en `run()` (ver `BaseController`).
 */
export class AppointmentController extends BaseController {
  public constructor(
    private readonly service: AppointmentService = new AppointmentService()
  ) {
    super();
  }

  // ================== READ ==================
  public async getAll(_req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const appointments = await this.service.getAll();
      res.status(200).json({ appointments });
    });
  }

  public async getOne(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const appointment = await this.service.getOne(this.paramId(req));
      res.status(200).json({ appointment });
    });
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const appointment = await this.service.create(req.body as CreateAppointmentDto);
      res.status(201).json({ appointment });
    });
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const appointment = await this.service.updatePut(
        this.paramId(req),
        req.body as UpdateAppointmentDto
      );
      res.status(200).json({ appointment });
    });
  }

  public async updatePatch(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const appointment = await this.service.updatePatch(
        this.paramId(req),
        req.body as PatchAppointmentDto
      );
      res.status(200).json({ appointment });
    });
  }

  // ================== DELETE ==================
  /** Eliminación física */
  public async deletePhysical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const id = this.paramId(req);
      await this.service.deletePhysical(id);
      res.status(200).json({ message: "Appointment permanently deleted", id });
    });
  }

  /** Eliminación lógica → status = inactive */
  public async deleteLogical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const appointment = await this.service.deleteLogical(this.paramId(req));
      res.status(200).json({
        message: "Appointment deactivated (logical delete)",
        appointment,
      });
    });
  }
}
