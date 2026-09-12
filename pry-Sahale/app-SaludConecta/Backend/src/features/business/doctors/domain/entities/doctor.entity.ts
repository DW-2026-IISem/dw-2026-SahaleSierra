import { Status } from '../../../../../common/enums/status.enum.js';

export interface DoctorProps {
  id?: number;
  name: string;
  description?: string;
  status?: Status;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Doctor {
  id?: number;
  name: string;
  description?: string;
  status: Status;
  createdAt?: Date;
  updatedAt?: Date;

  private constructor(props: DoctorProps) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.status = props.status ?? Status.ACTIVE;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(props: Omit<DoctorProps, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Doctor {
    if (!props.name?.trim()) {
      throw new Error('El nombre del médico es requerido');
    }
    return new Doctor(props);
  }

  static reconstitute(props: DoctorProps): Doctor {
    return new Doctor(props);
  }

  update(props: Partial<Omit<DoctorProps, 'id' | 'status' | 'createdAt' | 'updatedAt'>>): void {
    if (props.name !== undefined) {
      if (!props.name.trim()) {
        throw new Error('El nombre del médico es requerido');
      }
      this.name = props.name;
    }
    if (props.description !== undefined) {
      this.description = props.description;
    }
  }

  deactivate(): void {
    this.status = Status.INACTIVE;
  }
}
