import { Status } from '../../../../../common/enums/status.enum.js';

export interface AuthorizationProps {
  id?: number;
  appointmentId: number;
  name: string;
  description?: string;
  status?: Status;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Authorization {
  id?: number;
  appointmentId: number;
  name: string;
  description?: string;
  status: Status;
  createdAt?: Date;
  updatedAt?: Date;

  private constructor(props: AuthorizationProps) {
    this.id = props.id;
    this.appointmentId = props.appointmentId;
    this.name = props.name;
    this.description = props.description;
    this.status = props.status ?? Status.ACTIVE;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(
    props: Omit<AuthorizationProps, 'id' | 'status' | 'createdAt' | 'updatedAt'>,
  ): Authorization {
    if (!props.appointmentId) {
      throw new Error('La autorización requiere una cita asociada');
    }
    if (!props.name?.trim()) {
      throw new Error('El nombre de la autorización es requerido');
    }
    return new Authorization(props);
  }

  static reconstitute(props: AuthorizationProps): Authorization {
    return new Authorization(props);
  }

  update(props: Partial<Omit<AuthorizationProps, 'id' | 'appointmentId' | 'status' | 'createdAt' | 'updatedAt'>>): void {
    if (props.name !== undefined) {
      if (!props.name.trim()) {
        throw new Error('El nombre de la autorización es requerido');
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
