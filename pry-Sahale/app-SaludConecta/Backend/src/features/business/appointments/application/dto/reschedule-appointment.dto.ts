import { IsDateString, IsOptional, IsString } from 'class-validator';

export class RescheduleAppointmentDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  reason?: string;
}
