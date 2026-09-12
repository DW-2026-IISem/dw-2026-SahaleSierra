export class AppointmentResponseDto {
  id!: number;
  patientId!: number;
  agendaId!: number;
  startDate!: Date;
  endDate!: Date;
  reason!: string;
  status!: string;
  createdAt?: Date;
  updatedAt?: Date;
}
