import { Inject, Injectable } from '@nestjs/common';
import { DoctorSpecialtyNotFoundException } from '../../domain/exceptions/doctor-specialty-not-found.exception.js';
import { DOCTOR_SPECIALTY_REPOSITORY } from '../../domain/interfaces/doctor-specialty-repository.interface.js';
import type { DoctorSpecialtyRepository } from '../../domain/interfaces/doctor-specialty-repository.interface.js';

@Injectable()
export class DeleteDoctorSpecialtyUseCase {
  constructor(
    @Inject(DOCTOR_SPECIALTY_REPOSITORY)
    private readonly doctorSpecialtyRepository: DoctorSpecialtyRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const relation = await this.doctorSpecialtyRepository.findById(id);
    if (!relation) {
      throw new DoctorSpecialtyNotFoundException(id);
    }
    await this.doctorSpecialtyRepository.delete(id);
  }
}
