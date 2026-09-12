import { Inject, Injectable } from '@nestjs/common';
import { Encounter } from '../../domain/entities/encounter.entity.js';
import { AppointmentAlreadyAttendedException } from '../../domain/exceptions/appointment-already-attended.exception.js';
import { ClinicalRecordPatientMismatchException } from '../../domain/exceptions/clinical-record-patient-mismatch.exception.js';
import { ENCOUNTER_REPOSITORY } from '../../domain/interfaces/encounter-repository.interface.js';
import type { EncounterRepository } from '../../domain/interfaces/encounter-repository.interface.js';
import { APPOINTMENT_REPOSITORY } from '../../../appointments/domain/interfaces/appointment-repository.interface.js';
import type { AppointmentRepository } from '../../../appointments/domain/interfaces/appointment-repository.interface.js';
import { AppointmentNotFoundException } from '../../../appointments/domain/exceptions/appointment-not-found.exception.js';
import { SERVICE_REPOSITORY } from '../../../services/domain/interfaces/service-repository.interface.js';
import type { ServiceRepository } from '../../../services/domain/interfaces/service-repository.interface.js';
import { ServiceNotFoundException } from '../../../services/domain/exceptions/service-not-found.exception.js';
import { CLINICAL_RECORD_REPOSITORY } from '../../../clinical-records/domain/interfaces/clinical-record-repository.interface.js';
import type { ClinicalRecordRepository } from '../../../clinical-records/domain/interfaces/clinical-record-repository.interface.js';
import { ClinicalRecordNotFoundException } from '../../../clinical-records/domain/exceptions/clinical-record-not-found.exception.js';
import { CreateEncounterDto } from '../dto/create-encounter.dto.js';

@Injectable()
export class CreateEncounterUseCase {
  constructor(
    @Inject(ENCOUNTER_REPOSITORY) private readonly encounterRepository: EncounterRepository,
    @Inject(APPOINTMENT_REPOSITORY) private readonly appointmentRepository: AppointmentRepository,
    @Inject(SERVICE_REPOSITORY) private readonly serviceRepository: ServiceRepository,
    @Inject(CLINICAL_RECORD_REPOSITORY) private readonly clinicalRecordRepository: ClinicalRecordRepository,
  ) {}

  async execute(dto: CreateEncounterDto): Promise<Encounter> {
    const appointment = await this.appointmentRepository.findById(dto.appointmentId);
    if (!appointment) throw new AppointmentNotFoundException(dto.appointmentId);

    const existing = await this.encounterRepository.findByAppointmentId(dto.appointmentId);
    if (existing) throw new AppointmentAlreadyAttendedException(dto.appointmentId);

    const service = await this.serviceRepository.findById(dto.serviceId);
    if (!service) throw new ServiceNotFoundException(dto.serviceId);

    const clinicalRecord = await this.clinicalRecordRepository.findById(dto.clinicalRecordId);
    if (!clinicalRecord) throw new ClinicalRecordNotFoundException(dto.clinicalRecordId);
    if (clinicalRecord.patientId !== appointment.patientId) {
      throw new ClinicalRecordPatientMismatchException();
    }

    const encounter = Encounter.create({
      appointmentId: dto.appointmentId,
      serviceId: dto.serviceId,
      clinicalRecordId: dto.clinicalRecordId,
      startDate: appointment.startDate,
      endDate: appointment.endDate,
      total: dto.total,
      observations: dto.observations,
    });

    const created = await this.encounterRepository.create(encounter);

    appointment.markAttended();
    await this.appointmentRepository.update(appointment.id!, appointment);

    return created;
  }
}
