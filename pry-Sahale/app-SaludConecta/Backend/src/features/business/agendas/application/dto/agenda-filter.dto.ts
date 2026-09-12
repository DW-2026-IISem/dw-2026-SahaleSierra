import { IsInt, IsOptional, IsString } from 'class-validator';

export class AgendaFilterDto {
  @IsOptional()
  @IsInt()
  doctorId?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
