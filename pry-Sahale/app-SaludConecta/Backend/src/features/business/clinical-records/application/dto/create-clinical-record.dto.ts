import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateClinicalRecordDto {
  @IsInt()
  patientId!: number;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;
}
