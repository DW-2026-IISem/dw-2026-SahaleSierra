import { Inject, Injectable } from '@nestjs/common';
import { Doctor } from '../../domain/entities/doctor.entity.js';
import {
  DOCTOR_REPOSITORY,
  DoctorRepository,
} from '../../domain/interfaces/doctor-repository.interface.js';
import { CreateDoctorDto } from '../dto/create-doctor.dto.js';

@Injectable()
export class CreateDoctorUseCase {
  constructor(
    @Inject(DOCTOR_REPOSITORY) private readonly doctorRepository: DoctorRepository,
  ) {}

  async execute(dto: CreateDoctorDto): Promise<Doctor> {
    const doctor = Doctor.create({ name: dto.name, description: dto.description });
    return this.doctorRepository.create(doctor);
  }
}
