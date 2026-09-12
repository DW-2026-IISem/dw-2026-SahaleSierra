import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateEncounterDto {
  @IsInt()
  appointmentId!: number;

  @IsInt()
  serviceId!: number;

  @IsInt()
  clinicalRecordId!: number;

  @IsNumber()
  @Min(0)
  total!: number;

  @IsOptional()
  @IsString()
  observations?: string;
}
