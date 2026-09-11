import { IsDateString, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePatientDto {
  @IsIn(['CC', 'TI', 'CE', 'PASAPORTE', 'RC'])
  documentType!: 'CC' | 'TI' | 'CE' | 'PASAPORTE' | 'RC';

  @IsString()
  @IsNotEmpty()
  documentNumber!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsDateString()
  birthDate!: string;

  @IsOptional()
  @IsString()
  contact?: string;
}
