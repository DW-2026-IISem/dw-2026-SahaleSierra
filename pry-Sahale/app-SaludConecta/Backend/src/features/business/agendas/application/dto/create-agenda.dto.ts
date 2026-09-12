import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAgendaDto {
  @IsInt()
  doctorId!: number;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;
}
