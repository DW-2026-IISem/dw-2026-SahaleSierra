import { Status } from '../../../../../common/enums/status.enum.js';

export interface ServiceProps {
  id?: number;
  name: string;
  description?: string;
  status?: Status;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Service {
  id?: number;
  name: string;
  description?: string;
  status: Status;
  createdAt?: Date;
  updatedAt?: Date;

  private constructor(props: ServiceProps) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.status = props.status ?? Status.ACTIVE;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(props: Omit<ServiceProps, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Service {
    if (!props.name?.trim()) {
      throw new Error('El nombre del servicio es requerido');
    }
    return new Service(props);
  }

  static reconstitute(props: ServiceProps): Service {
    return new Service(props);
  }

  update(props: Partial<Omit<ServiceProps, 'id' | 'status' | 'createdAt' | 'updatedAt'>>): void {
    if (props.name !== undefined) {
      if (!props.name.trim()) {
        throw new Error('El nombre del servicio es requerido');
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
