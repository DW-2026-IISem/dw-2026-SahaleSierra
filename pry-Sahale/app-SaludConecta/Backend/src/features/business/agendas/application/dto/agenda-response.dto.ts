export class AgendaResponseDto {
  id!: number;
  doctorId!: number;
  name!: string;
  description?: string;
  status!: string;
  createdAt?: Date;
  updatedAt?: Date;
}
