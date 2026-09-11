import { Status } from '../../../../../common/enums/status.enum.js';

export interface SpecialtyProps {
  id?: number;
  name: string;
  description?: string;
  status?: Status;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Specialty {
  id?: number;
  name: string;
  description?: string;
  status: Status;
  createdAt?: Date;
  updatedAt?: Date;

  private constructor(props: SpecialtyProps) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.status = props.status ?? Status.ACTIVE;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(props: Omit<SpecialtyProps, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Specialty {
    if (!props.name?.trim()) {
      throw new Error('El nombre de la especialidad es requerido');
    }
    return new Specialty(props);
  }

  static reconstitute(props: SpecialtyProps): Specialty {
    return new Specialty(props);
  }

  update(props: Partial<Omit<SpecialtyProps, 'id' | 'status' | 'createdAt' | 'updatedAt'>>): void {
    if (props.name !== undefined) {
      if (!props.name.trim()) {
        throw new Error('El nombre de la especialidad es requerido');
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
