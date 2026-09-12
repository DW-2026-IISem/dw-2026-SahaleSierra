import { Inject, Injectable } from '@nestjs/common';
import { Agenda } from '../../domain/entities/agenda.entity.js';
import { AGENDA_REPOSITORY } from '../../domain/interfaces/agenda-repository.interface.js';
import type { AgendaRepository } from '../../domain/interfaces/agenda-repository.interface.js';
import { DOCTOR_REPOSITORY } from '../../../doctors/domain/interfaces/doctor-repository.interface.js';
import type { DoctorRepository } from '../../../doctors/domain/interfaces/doctor-repository.interface.js';
import { DoctorNotFoundException } from '../../../doctors/domain/exceptions/doctor-not-found.exception.js';
import { CreateAgendaDto } from '../dto/create-agenda.dto.js';

@Injectable()
export class CreateAgendaUseCase {
  constructor(
    @Inject(AGENDA_REPOSITORY) private readonly agendaRepository: AgendaRepository,
    @Inject(DOCTOR_REPOSITORY) private readonly doctorRepository: DoctorRepository,
  ) {}

  async execute(dto: CreateAgendaDto): Promise<Agenda> {
    const doctor = await this.doctorRepository.findById(dto.doctorId);
    if (!doctor) {
      throw new DoctorNotFoundException(dto.doctorId);
    }

    const agenda = Agenda.create({
      doctorId: dto.doctorId,
      name: dto.name,
      description: dto.description,
    });

    return this.agendaRepository.create(agenda);
  }
}
