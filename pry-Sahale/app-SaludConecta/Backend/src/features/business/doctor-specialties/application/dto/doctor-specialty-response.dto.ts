export class DoctorSpecialtyResponseDto {
  id!: number;
  doctorId!: number;
  specialtyId!: number;
  relationData?: string;
  status!: string;
  createdAt?: Date;
  updatedAt?: Date;
}
