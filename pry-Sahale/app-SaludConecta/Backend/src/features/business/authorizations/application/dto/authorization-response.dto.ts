export class AuthorizationResponseDto {
  id!: number;
  appointmentId!: number;
  name!: string;
  description?: string;
  status!: string;
  createdAt?: Date;
  updatedAt?: Date;
}
