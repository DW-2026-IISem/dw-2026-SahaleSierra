import { Inject, Injectable } from '@nestjs/common';
import { Agenda } from '../../domain/entities/agenda.entity.js';
import { AgendaNotFoundException } from '../../domain/exceptions/agenda-not-found.exception.js';
import { AGENDA_REPOSITORY } from '../../domain/interfaces/agenda-repository.interface.js';
import type { AgendaRepository } from '../../domain/interfaces/agenda-repository.interface.js';
import { UpdateAgendaDto } from '../dto/update-agenda.dto.js';

@Injectable()
export class UpdateAgendaUseCase {
  constructor(@Inject(AGENDA_REPOSITORY) private readonly agendaRepository: AgendaRepository) {}

  async execute(id: number, dto: UpdateAgendaDto): Promise<Agenda> {
    const agenda = await this.agendaRepository.findById(id);
    if (!agenda) {
      throw new AgendaNotFoundException(id);
    }
    agenda.update({ name: dto.name, description: dto.description });
    return this.agendaRepository.update(id, agenda);
  }
}
