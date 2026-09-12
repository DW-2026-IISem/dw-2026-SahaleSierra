import { ArrayMinSize, IsArray, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateInvoiceDto {
  @IsString()
  @IsNotEmpty()
  number!: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  encounterIds!: number[];
}
