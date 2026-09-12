import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateEncounterDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  total?: number;

  @IsOptional()
  @IsString()
  observations?: string;
}
