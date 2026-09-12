import { Inject, Injectable } from '@nestjs/common';
import { Doctor } from '../../domain/entities/doctor.entity.js';
import { DoctorNotFoundException } from '../../domain/exceptions/doctor-not-found.exception.js';
import {
  DOCTOR_REPOSITORY,
  DoctorRepository,
} from '../../domain/interfaces/doctor-repository.interface.js';
import { UpdateDoctorDto } from '../dto/update-doctor.dto.js';

@Injectable()
export class UpdateDoctorUseCase {
  constructor(
    @Inject(DOCTOR_REPOSITORY) private readonly doctorRepository: DoctorRepository,
  ) {}

  async execute(id: number, dto: UpdateDoctorDto): Promise<Doctor> {
    const doctor = await this.doctorRepository.findById(id);
    if (!doctor) {
      throw new DoctorNotFoundException(id);
    }
    doctor.update({ name: dto.name, description: dto.description });
    return this.doctorRepository.update(id, doctor);
  }
}
