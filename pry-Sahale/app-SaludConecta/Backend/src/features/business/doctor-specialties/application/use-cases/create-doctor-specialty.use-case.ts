import { Inject, Injectable } from '@nestjs/common';
import { DoctorSpecialty } from '../../domain/entities/doctor-specialty.entity.js';
import { DoctorSpecialtyAlreadyExistsException } from '../../domain/exceptions/doctor-specialty-already-exists.exception.js';
import { DOCTOR_SPECIALTY_REPOSITORY } from '../../domain/interfaces/doctor-specialty-repository.interface.js';
import type { DoctorSpecialtyRepository } from '../../domain/interfaces/doctor-specialty-repository.interface.js';
import { DOCTOR_REPOSITORY } from '../../../doctors/domain/interfaces/doctor-repository.interface.js';
import type { DoctorRepository } from '../../../doctors/domain/interfaces/doctor-repository.interface.js';
import { SPECIALTY_REPOSITORY } from '../../../specialties/domain/interfaces/specialty-repository.interface.js';
import type { SpecialtyRepository } from '../../../specialties/domain/interfaces/specialty-repository.interface.js';
import { DoctorNotFoundException } from '../../../doctors/domain/exceptions/doctor-not-found.exception.js';
import { SpecialtyNotFoundException } from '../../../specialties/domain/exceptions/specialty-not-found.exception.js';
import { CreateDoctorSpecialtyDto } from '../dto/create-doctor-specialty.dto.js';

@Injectable()
export class CreateDoctorSpecialtyUseCase {
  constructor(
    @Inject(DOCTOR_SPECIALTY_REPOSITORY)
    private readonly doctorSpecialtyRepository: DoctorSpecialtyRepository,
    @Inject(DOCTOR_REPOSITORY) private readonly doctorRepository: DoctorRepository,
    @Inject(SPECIALTY_REPOSITORY) private readonly specialtyRepository: SpecialtyRepository,
  ) {}

  async execute(dto: CreateDoctorSpecialtyDto): Promise<DoctorSpecialty> {
    const doctor = await this.doctorRepository.findById(dto.doctorId);
    if (!doctor) throw new DoctorNotFoundException(dto.doctorId);

    const specialty = await this.specialtyRepository.findById(dto.specialtyId);
    if (!specialty) throw new SpecialtyNotFoundException(dto.specialtyId);

    const existing = await this.doctorSpecialtyRepository.findByPair(dto.doctorId, dto.specialtyId);
    if (existing) {
      throw new DoctorSpecialtyAlreadyExistsException(dto.doctorId, dto.specialtyId);
    }

    const relation = DoctorSpecialty.create({
      doctorId: dto.doctorId,
      specialtyId: dto.specialtyId,
      relationData: dto.relationData,
    });

    return this.doctorSpecialtyRepository.create(relation);
  }
}
