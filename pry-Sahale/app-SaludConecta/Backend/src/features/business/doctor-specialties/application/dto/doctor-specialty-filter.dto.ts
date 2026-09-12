import { IsInt, IsOptional } from 'class-validator';

export class DoctorSpecialtyFilterDto {
  @IsOptional()
  @IsInt()
  doctorId?: number;

  @IsOptional()
  @IsInt()
  specialtyId?: number;
}
