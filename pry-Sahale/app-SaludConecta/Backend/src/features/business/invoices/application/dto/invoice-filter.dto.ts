import { IsOptional, IsString } from 'class-validator';

export class InvoiceFilterDto {
  @IsOptional()
  @IsString()
  number?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
