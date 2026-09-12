import { IsOptional, IsString } from 'class-validator';

export class SpecialtyFilterDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
