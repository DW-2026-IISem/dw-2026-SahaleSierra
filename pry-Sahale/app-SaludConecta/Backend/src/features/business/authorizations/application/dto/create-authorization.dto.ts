import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAuthorizationDto {
  @IsInt()
  appointmentId!: number;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;
}
