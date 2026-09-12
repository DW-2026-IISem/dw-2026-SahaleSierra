import { PartialType } from '@nestjs/mapped-types';
import { CreateDoctorDto } from './create-doctor.dto.js';

export class UpdateDoctorDto extends PartialType(CreateDoctorDto) {}
