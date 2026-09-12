export class ClinicalRecordResponseDto {
  id!: number;
  patientId!: number;
  name!: string;
  description?: string;
  status!: string;
  createdAt?: Date;
  updatedAt?: Date;
}
