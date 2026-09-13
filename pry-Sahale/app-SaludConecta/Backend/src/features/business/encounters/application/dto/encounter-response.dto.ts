export class EncounterResponseDto {
  id!: number;
  appointmentId!: number;
  serviceId!: number;
  clinicalRecordId!: number;
  invoiceId?: number;
  startDate!: Date;
  endDate!: Date;
  total!: number;
  observations?: string;
  status!: string;
  createdAt?: Date;
  updatedAt?: Date;
}
