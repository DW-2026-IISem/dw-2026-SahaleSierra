import { AppointmentStatus } from '../enums/appointment-status.enum.js';

export interface AppointmentProps {
  id?: number;
  patientId: number;
  agendaId: number;
  startDate: Date;
  endDate: Date;
  reason: string;
  status?: AppointmentStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Appointment {
  id?: number;
  patientId: number;
  agendaId: number;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: AppointmentStatus;
  createdAt?: Date;
  updatedAt?: Date;

  private constructor(props: AppointmentProps) {
    this.id = props.id;
    this.patientId = props.patientId;
    this.agendaId = props.agendaId;
    this.startDate = props.startDate;
    this.endDate = props.endDate;
    this.reason = props.reason;
    this.status = props.status ?? AppointmentStatus.SCHEDULED;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(
    props: Omit<AppointmentProps, 'id' | 'status' | 'createdAt' | 'updatedAt'>,
  ): Appointment {
    if (!props.patientId) throw new Error('La cita requiere un paciente');
    if (!props.agendaId) throw new Error('La cita requiere una agenda');
    if (!props.reason?.trim()) throw new Error('El motivo de la cita es requerido');
    if (props.endDate <= props.startDate) {
      throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');
    }
    return new Appointment(props);
  }

  static reconstitute(props: AppointmentProps): Appointment {
    return new Appointment(props);
  }

  reschedule(startDate?: Date, endDate?: Date, reason?: string): void {
    if (this.status !== AppointmentStatus.SCHEDULED) {
      throw new Error('Solo una cita programada puede reprogramarse');
    }
    const newStart = startDate ?? this.startDate;
    const newEnd = endDate ?? this.endDate;
    if (newEnd <= newStart) {
      throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');
    }
    this.startDate = newStart;
    this.endDate = newEnd;
    if (reason !== undefined) {
      if (!reason.trim()) throw new Error('El motivo de la cita es requerido');
      this.reason = reason;
    }
  }

  cancel(): void {
    if (this.status === AppointmentStatus.ATTENDED) {
      throw new Error('Una cita ya atendida no puede cancelarse');
    }
    this.status = AppointmentStatus.CANCELLED;
  }

  markAttended(): void {
    if (this.status !== AppointmentStatus.SCHEDULED) {
      throw new Error('Solo una cita programada puede pasar a atendida');
    }
    this.status = AppointmentStatus.ATTENDED;
  }

  markNoShow(): void {
    if (this.status !== AppointmentStatus.SCHEDULED) {
      throw new Error('Solo una cita programada puede marcarse como inasistencia');
    }
    this.status = AppointmentStatus.NO_SHOW;
  }
}
