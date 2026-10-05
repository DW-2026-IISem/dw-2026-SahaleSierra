import { UpdateAgendaDto } from "./update-agenda.dto";

/** Datos de entrada de `PATCH /api/agendas/:id` (actualización parcial). */
export type PatchAgendaDto = Partial<UpdateAgendaDto>;
