import { IsDateString, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @IsInt()
  patientId!: number;

  @IsInt()
  agendaId!: number;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;

  @IsString()
  @IsNotEmpty()
  reason!: string;
}
