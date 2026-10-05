import { Request, Response } from "express";
import { BaseController } from "../../../shared/http/base-controller";
import { CreateAgendaDto, PatchAgendaDto, UpdateAgendaDto } from "./dto";
import { AgendaService } from "./agenda.service";

/**
 * Capa Controller del feature Agenda.
 * Solo HTTP: lee `req`, llama al service y arma la respuesta.
 * El manejo de errores se delega en `run()` (ver `BaseController`).
 */
export class AgendaController extends BaseController {
  public constructor(
    private readonly service: AgendaService = new AgendaService()
  ) {
    super();
  }

  // ================== READ ==================
  public async getAll(_req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const agendas = await this.service.getAll();
      res.status(200).json({ agendas });
    });
  }

  public async getOne(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const agenda = await this.service.getOne(this.paramId(req));
      res.status(200).json({ agenda });
    });
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const agenda = await this.service.create(req.body as CreateAgendaDto);
      res.status(201).json({ agenda });
    });
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const agenda = await this.service.updatePut(
        this.paramId(req),
        req.body as UpdateAgendaDto
      );
      res.status(200).json({ agenda });
    });
  }

  public async updatePatch(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const agenda = await this.service.updatePatch(
        this.paramId(req),
        req.body as PatchAgendaDto
      );
      res.status(200).json({ agenda });
    });
  }

  // ================== DELETE ==================
  /** Eliminación física */
  public async deletePhysical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const id = this.paramId(req);
      await this.service.deletePhysical(id);
      res.status(200).json({ message: "Agenda permanently deleted", id });
    });
  }

  /** Eliminación lógica → status = inactive */
  public async deleteLogical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const agenda = await this.service.deleteLogical(this.paramId(req));
      res.status(200).json({
        message: "Agenda deactivated (logical delete)",
        agenda,
      });
    });
  }
}
