import { Inject, Injectable } from '@nestjs/common';
import { Doctor } from '../../domain/entities/doctor.entity.js';
import { DoctorNotFoundException } from '../../domain/exceptions/doctor-not-found.exception.js';
import { DOCTOR_REPOSITORY } from '../../domain/interfaces/doctor-repository.interface.js';
import type { DoctorRepository } from '../../domain/interfaces/doctor-repository.interface.js';

@Injectable()
export class GetDoctorUseCase {
  constructor(
    @Inject(DOCTOR_REPOSITORY) private readonly doctorRepository: DoctorRepository,
  ) {}

  async execute(id: number): Promise<Doctor> {
    const doctor = await this.doctorRepository.findById(id);
    if (!doctor) {
      throw new DoctorNotFoundException(id);
    }
    return doctor;
  }
}
