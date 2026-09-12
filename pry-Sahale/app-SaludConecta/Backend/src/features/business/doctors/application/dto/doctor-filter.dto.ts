import { IsOptional, IsString } from 'class-validator';

export class DoctorFilterDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
