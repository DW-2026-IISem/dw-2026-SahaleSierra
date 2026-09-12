import { Status } from '../../../../../common/enums/status.enum.js';

export interface AgendaProps {
  id?: number;
  doctorId: number;
  name: string;
  description?: string;
  status?: Status;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Agenda {
  id?: number;
  doctorId: number;
  name: string;
  description?: string;
  status: Status;
  createdAt?: Date;
  updatedAt?: Date;

  private constructor(props: AgendaProps) {
    this.id = props.id;
    this.doctorId = props.doctorId;
    this.name = props.name;
    this.description = props.description;
    this.status = props.status ?? Status.ACTIVE;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(props: Omit<AgendaProps, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Agenda {
    if (!props.doctorId) {
      throw new Error('La agenda requiere un médico asociado');
    }
    if (!props.name?.trim()) {
      throw new Error('El nombre de la agenda es requerido');
    }
    return new Agenda(props);
  }

  static reconstitute(props: AgendaProps): Agenda {
    return new Agenda(props);
  }

  update(props: Partial<Omit<AgendaProps, 'id' | 'doctorId' | 'status' | 'createdAt' | 'updatedAt'>>): void {
    if (props.name !== undefined) {
      if (!props.name.trim()) {
        throw new Error('El nombre de la agenda es requerido');
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
