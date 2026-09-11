export class PatientResponseDto {
  id!: number;
  documentType!: string;
  documentNumber!: string;
  name!: string;
  birthDate!: Date;
  contact?: string;
  status!: string;
  createdAt?: Date;
  updatedAt?: Date;
}
