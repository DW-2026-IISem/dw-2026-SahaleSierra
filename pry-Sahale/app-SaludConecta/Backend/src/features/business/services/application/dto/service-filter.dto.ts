import { IsOptional, IsString } from 'class-validator';

export class ServiceFilterDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
