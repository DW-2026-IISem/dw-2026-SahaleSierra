import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateDoctorSpecialtyDto {
  @IsInt()
  doctorId!: number;

  @IsInt()
  specialtyId!: number;

  @IsOptional()
  @IsString()
  relationData?: string;
}
