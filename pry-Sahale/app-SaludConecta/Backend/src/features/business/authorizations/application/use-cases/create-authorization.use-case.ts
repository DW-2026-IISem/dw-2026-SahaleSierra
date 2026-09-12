import { Inject, Injectable } from '@nestjs/common';
import { Authorization } from '../../domain/entities/authorization.entity.js';
import { AppointmentAlreadyAuthorizedException } from '../../domain/exceptions/appointment-already-authorized.exception.js';
import { AUTHORIZATION_REPOSITORY } from '../../domain/interfaces/authorization-repository.interface.js';
import type { AuthorizationRepository } from '../../domain/interfaces/authorization-repository.interface.js';
import { APPOINTMENT_REPOSITORY } from '../../../appointments/domain/interfaces/appointment-repository.interface.js';
import type { AppointmentRepository } from '../../../appointments/domain/interfaces/appointment-repository.interface.js';
import { AppointmentNotFoundException } from '../../../appointments/domain/exceptions/appointment-not-found.exception.js';
import { CreateAuthorizationDto } from '../dto/create-authorization.dto.js';

@Injectable()
export class CreateAuthorizationUseCase {
  constructor(
    @Inject(AUTHORIZATION_REPOSITORY) private readonly authorizationRepository: AuthorizationRepository,
    @Inject(APPOINTMENT_REPOSITORY) private readonly appointmentRepository: AppointmentRepository,
  ) {}

  async execute(dto: CreateAuthorizationDto): Promise<Authorization> {
    const appointment = await this.appointmentRepository.findById(dto.appointmentId);
    if (!appointment) throw new AppointmentNotFoundException(dto.appointmentId);

    const existing = await this.authorizationRepository.findByAppointmentId(dto.appointmentId);
    if (existing) throw new AppointmentAlreadyAuthorizedException(dto.appointmentId);

    const authorization = Authorization.create({
      appointmentId: dto.appointmentId,
      name: dto.name,
      description: dto.description,
    });

    return this.authorizationRepository.create(authorization);
  }
}
