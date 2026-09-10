import { Status } from '../../../../../common/enums/status.enum.js';
import { isValidEmail } from '../validators/client-email.validator.js';
import { isValidPhone } from '../validators/client-phone.validator.js';

export interface ClientProps {
  id?: number;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  password?: string;
  status?: Status;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Client {
  id?: number;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  password?: string;
  status: Status;
  createdAt?: Date;
  updatedAt?: Date;

  private constructor(props: ClientProps) {
    this.id = props.id;
    this.name = props.name;
    this.address = props.address;
    this.phone = props.phone;
    this.email = props.email;
    this.password = props.password;
    this.status = props.status ?? Status.ACTIVE;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(
    props: Omit<ClientProps, 'id' | 'status' | 'createdAt' | 'updatedAt'>,
  ): Client {
    if (!props.name?.trim()) {
      throw new Error('El nombre del cliente es requerido');
    }

    if (props.email && !isValidEmail(props.email)) {
      throw new Error('El email del cliente no es válido');
    }

    if (props.phone && !isValidPhone(props.phone)) {
      throw new Error('El teléfono del cliente no es válido');
    }

    return new Client(props);
  }

  static reconstitute(props: ClientProps): Client {
    return new Client(props);
  }

  update(
    props: Partial<
      Omit<ClientProps, 'id' | 'status' | 'createdAt' | 'updatedAt'>
    >,
  ): void {
    if (props.name !== undefined) {
      if (!props.name.trim()) {
        throw new Error('El nombre del cliente es requerido');
      }
      this.name = props.name;
    }

    if (props.address !== undefined) {
      this.address = props.address;
    }

    if (props.phone !== undefined) {
      if (props.phone && !isValidPhone(props.phone)) {
        throw new Error('El teléfono del cliente no es válido');
      }
      this.phone = props.phone;
    }

    if (props.email !== undefined) {
      if (props.email && !isValidEmail(props.email)) {
        throw new Error('El email del cliente no es válido');
      }
      this.email = props.email;
    }

    if (props.password !== undefined) {
      this.password = props.password;
    }
  }

  deactivate(): void {
    this.status = Status.INACTIVE;
  }
}
