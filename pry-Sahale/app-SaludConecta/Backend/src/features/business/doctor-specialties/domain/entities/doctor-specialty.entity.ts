import { Status } from '../../../../../common/enums/status.enum.js';

export interface DoctorSpecialtyProps {
  id?: number;
  doctorId: number;
  specialtyId: number;
  relationData?: string;
  status?: Status;
  createdAt?: Date;
  updatedAt?: Date;
}

export class DoctorSpecialty {
  id?: number;
  doctorId: number;
  specialtyId: number;
  relationData?: string;
  status: Status;
  createdAt?: Date;
  updatedAt?: Date;

  private constructor(props: DoctorSpecialtyProps) {
    this.id = props.id;
    this.doctorId = props.doctorId;
    this.specialtyId = props.specialtyId;
    this.relationData = props.relationData;
    this.status = props.status ?? Status.ACTIVE;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(
    props: Omit<DoctorSpecialtyProps, 'id' | 'status' | 'createdAt' | 'updatedAt'>,
  ): DoctorSpecialty {
    if (!props.doctorId) {
      throw new Error('El médico es requerido para asignar una especialidad');
    }
    if (!props.specialtyId) {
      throw new Error('La especialidad es requerida para la asignación');
    }
    return new DoctorSpecialty(props);
  }

  static reconstitute(props: DoctorSpecialtyProps): DoctorSpecialty {
    return new DoctorSpecialty(props);
  }

  deactivate(): void {
    this.status = Status.INACTIVE;
  }
}
