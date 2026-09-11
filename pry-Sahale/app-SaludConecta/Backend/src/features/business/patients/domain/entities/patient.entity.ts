import { Status } from '../../../../../common/enums/status.enum.js';
import { isValidDocumentNumber } from '../validators/patient-document.validator.js';
import { isValidContact } from '../validators/patient-contact.validator.js';

export type DocumentType = 'CC' | 'TI' | 'CE' | 'PASAPORTE' | 'RC';

export interface PatientProps {
  id?: number;
  documentType: DocumentType;
  documentNumber: string;
  name: string;
  birthDate: Date;
  contact?: string;
  status?: Status;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Patient {
  id?: number;
  documentType: DocumentType;
  documentNumber: string;
  name: string;
  birthDate: Date;
  contact?: string;
  status: Status;
  createdAt?: Date;
  updatedAt?: Date;

  private constructor(props: PatientProps) {
    this.id = props.id;
    this.documentType = props.documentType;
    this.documentNumber = props.documentNumber;
    this.name = props.name;
    this.birthDate = props.birthDate;
    this.contact = props.contact;
    this.status = props.status ?? Status.ACTIVE;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(
    props: Omit<PatientProps, 'id' | 'status' | 'createdAt' | 'updatedAt'>,
  ): Patient {
    if (!props.name?.trim()) {
      throw new Error('El nombre del paciente es requerido');
    }
    if (!props.documentNumber?.trim() || !isValidDocumentNumber(props.documentNumber)) {
      throw new Error('El número de documento del paciente no es válido');
    }
    if (!props.birthDate) {
      throw new Error('La fecha de nacimiento del paciente es requerida');
    }
    if (props.birthDate > new Date()) {
      throw new Error('La fecha de nacimiento no puede ser futura');
    }
    if (props.contact && !isValidContact(props.contact)) {
      throw new Error('El contacto del paciente no es válido');
    }

    return new Patient(props);
  }

  static reconstitute(props: PatientProps): Patient {
    return new Patient(props);
  }

  update(
    props: Partial<
      Omit<PatientProps, 'id' | 'documentNumber' | 'status' | 'createdAt' | 'updatedAt'>
    >,
  ): void {
    if (props.name !== undefined) {
      if (!props.name.trim()) {
        throw new Error('El nombre del paciente es requerido');
      }
      this.name = props.name;
    }
    if (props.documentType !== undefined) {
      this.documentType = props.documentType;
    }
    if (props.birthDate !== undefined) {
      if (props.birthDate > new Date()) {
        throw new Error('La fecha de nacimiento no puede ser futura');
      }
      this.birthDate = props.birthDate;
    }
    if (props.contact !== undefined) {
      if (props.contact && !isValidContact(props.contact)) {
        throw new Error('El contacto del paciente no es válido');
      }
      this.contact = props.contact;
    }
  }

  deactivate(): void {
    this.status = Status.INACTIVE;
  }

  activate(): void {
    this.status = Status.ACTIVE;
  }
}
