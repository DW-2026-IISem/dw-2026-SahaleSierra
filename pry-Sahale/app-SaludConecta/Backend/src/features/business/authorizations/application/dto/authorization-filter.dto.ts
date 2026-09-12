import { IsInt, IsOptional, IsString } from 'class-validator';

export class AuthorizationFilterDto {
  @IsOptional()
  @IsInt()
  appointmentId?: number;

  @IsOptional()
  @IsString()
  status?: string;
}
