import { IsInt, IsOptional, IsString } from 'class-validator';

export class ClinicalRecordFilterDto {
  @IsOptional()
  @IsInt()
  patientId?: number;

  @IsOptional()
  @IsString()
  status?: string;
}
