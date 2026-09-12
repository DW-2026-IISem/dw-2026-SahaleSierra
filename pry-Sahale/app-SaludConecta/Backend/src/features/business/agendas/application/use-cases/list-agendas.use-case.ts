import { Inject, Injectable } from '@nestjs/common';
import { Agenda } from '../../domain/entities/agenda.entity.js';
import { AGENDA_REPOSITORY } from '../../domain/interfaces/agenda-repository.interface.js';
import type { AgendaFilter, AgendaRepository } from '../../domain/interfaces/agenda-repository.interface.js';
import type { PaginationParams } from '../../../../../common/interfaces/pagination.interface.js';

@Injectable()
export class ListAgendasUseCase {
  constructor(@Inject(AGENDA_REPOSITORY) private readonly agendaRepository: AgendaRepository) {}

  async execute(filter: AgendaFilter, pagination: PaginationParams): Promise<{ data: Agenda[]; total: number }> {
    return this.agendaRepository.findAll(filter, pagination);
  }
}
