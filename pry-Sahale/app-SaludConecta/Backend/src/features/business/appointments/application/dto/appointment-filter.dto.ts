import { IsInt, IsOptional, IsString } from 'class-validator';

export class AppointmentFilterDto {
  @IsOptional()
  @IsInt()
  patientId?: number;

  @IsOptional()
  @IsInt()
  agendaId?: number;

  @IsOptional()
  @IsString()
  status?: string;
}
