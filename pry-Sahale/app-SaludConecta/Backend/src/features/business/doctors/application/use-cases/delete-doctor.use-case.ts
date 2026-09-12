import { Inject, Injectable } from '@nestjs/common';
import { DoctorNotFoundException } from '../../domain/exceptions/doctor-not-found.exception.js';
import {
  DOCTOR_REPOSITORY,
  DoctorRepository,
} from '../../domain/interfaces/doctor-repository.interface.js';

@Injectable()
export class DeleteDoctorUseCase {
  constructor(
    @Inject(DOCTOR_REPOSITORY) private readonly doctorRepository: DoctorRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const doctor = await this.doctorRepository.findById(id);
    if (!doctor) {
      throw new DoctorNotFoundException(id);
    }
    await this.doctorRepository.delete(id);
  }
}
