import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDoctorDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;
}
