import { IsOptional, IsString } from 'class-validator';

export class PatientFilterDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  documentNumber?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
