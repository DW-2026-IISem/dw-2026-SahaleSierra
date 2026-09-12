import { IsInt, IsOptional, IsString } from 'class-validator';

export class EncounterFilterDto {
  @IsOptional()
  @IsInt()
  appointmentId?: number;

  @IsOptional()
  @IsInt()
  serviceId?: number;

  @IsOptional()
  @IsInt()
  clinicalRecordId?: number;

  @IsOptional()
  @IsString()
  status?: string;
}
