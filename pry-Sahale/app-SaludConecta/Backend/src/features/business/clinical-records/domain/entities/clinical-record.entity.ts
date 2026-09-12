import { Status } from '../../../../../common/enums/status.enum.js';

export interface ClinicalRecordProps {
  id?: number;
  patientId: number;
  name: string;
  description?: string;
  status?: Status;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ClinicalRecord {
  id?: number;
  patientId: number;
  name: string;
  description?: string;
  status: Status;
  createdAt?: Date;
  updatedAt?: Date;

  private constructor(props: ClinicalRecordProps) {
    this.id = props.id;
    this.patientId = props.patientId;
    this.name = props.name;
    this.description = props.description;
    this.status = props.status ?? Status.ACTIVE;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(
    props: Omit<ClinicalRecordProps, 'id' | 'status' | 'createdAt' | 'updatedAt'>,
  ): ClinicalRecord {
    if (!props.patientId) {
      throw new Error('La historia clínica requiere un paciente asociado');
    }
    if (!props.name?.trim()) {
      throw new Error('El nombre de la historia clínica es requerido');
    }
    return new ClinicalRecord(props);
  }

  static reconstitute(props: ClinicalRecordProps): ClinicalRecord {
    return new ClinicalRecord(props);
  }

  update(
    props: Partial<Omit<ClinicalRecordProps, 'id' | 'patientId' | 'status' | 'createdAt' | 'updatedAt'>>,
  ): void {
    if (props.name !== undefined) {
      if (!props.name.trim()) {
        throw new Error('El nombre de la historia clínica es requerido');
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
