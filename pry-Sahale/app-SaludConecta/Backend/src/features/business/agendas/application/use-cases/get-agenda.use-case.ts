import { Inject, Injectable } from '@nestjs/common';
import { Agenda } from '../../domain/entities/agenda.entity.js';
import { AgendaNotFoundException } from '../../domain/exceptions/agenda-not-found.exception.js';
import { AGENDA_REPOSITORY } from '../../domain/interfaces/agenda-repository.interface.js';
import type { AgendaRepository } from '../../domain/interfaces/agenda-repository.interface.js';

@Injectable()
export class GetAgendaUseCase {
  constructor(@Inject(AGENDA_REPOSITORY) private readonly agendaRepository: AgendaRepository) {}

  async execute(id: number): Promise<Agenda> {
    const agenda = await this.agendaRepository.findById(id);
    if (!agenda) {
      throw new AgendaNotFoundException(id);
    }
    return agenda;
  }
}
