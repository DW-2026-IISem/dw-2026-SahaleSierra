export class InvoiceResponseDto {
  id!: number;
  number!: string;
  date!: Date;
  subtotal!: number;
  tax!: number;
  total!: number;
  status!: string;
  createdAt?: Date;
  updatedAt?: Date;
}
