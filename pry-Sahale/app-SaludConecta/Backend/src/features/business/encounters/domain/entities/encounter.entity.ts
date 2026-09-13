import { EncounterStatus } from '../enums/encounter-status.enum.js';

export interface EncounterProps {
  id?: number;
  appointmentId: number;
  serviceId: number;
  clinicalRecordId: number;
  invoiceId?: number;
  startDate: Date;
  endDate: Date;
  total: number;
  observations?: string;
  status?: EncounterStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Encounter {
  id?: number;
  appointmentId: number;
  serviceId: number;
  clinicalRecordId: number;
  invoiceId?: number;
  startDate: Date;
  endDate: Date;
  total: number;
  observations?: string;
  status: EncounterStatus;
  createdAt?: Date;
  updatedAt?: Date;

  private constructor(props: EncounterProps) {
    this.id = props.id;
    this.appointmentId = props.appointmentId;
    this.serviceId = props.serviceId;
    this.clinicalRecordId = props.clinicalRecordId;
    this.invoiceId = props.invoiceId;
    this.startDate = props.startDate;
    this.endDate = props.endDate;
    this.total = props.total;
    this.observations = props.observations;
    this.status = props.status ?? EncounterStatus.REGISTERED;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(
    props: Omit<EncounterProps, 'id' | 'invoiceId' | 'status' | 'createdAt' | 'updatedAt'>,
  ): Encounter {
    if (!props.appointmentId) throw new Error('La atención requiere una cita asociada');
    if (!props.serviceId) throw new Error('La atención requiere un servicio');
    if (!props.clinicalRecordId) throw new Error('La atención requiere una historia clínica');
    if (props.endDate <= props.startDate) {
      throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');
    }
    if (props.total < 0) throw new Error('El total de la atención no puede ser negativo');

    return new Encounter(props);
  }

  static reconstitute(props: EncounterProps): Encounter {
    return new Encounter(props);
  }

  update(props: Partial<Pick<EncounterProps, 'total' | 'observations'>>): void {
    if (props.total !== undefined) {
      if (props.total < 0) throw new Error('El total de la atención no puede ser negativo');
      this.total = props.total;
    }
    if (props.observations !== undefined) {
      this.observations = props.observations;
    }
  }

  assignInvoice(invoiceId: number): void {
    if (this.invoiceId) {
      throw new Error('Esta atención ya está asociada a una factura');
    }
    this.invoiceId = invoiceId;
  }

  cancel(): void {
    this.status = EncounterStatus.CANCELLED;
  }
}
