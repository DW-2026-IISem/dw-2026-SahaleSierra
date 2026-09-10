import { Status } from '../../../../../common/enums/status.enum.js';
import { isValidEmail } from '../../../clients/domain/validators/client-email.validator.js';
import { isValidPhone } from '../../../clients/domain/validators/client-phone.validator.js';

export interface SupplierProps {
  id?: number;
  name: string;
  contactName?: string;
  address?: string;
  phone?: string;
  email?: string;
  status?: Status;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Supplier {
  id?: number;
  name: string;
  contactName?: string;
  address?: string;
  phone?: string;
  email?: string;
  status: Status;
  createdAt?: Date;
  updatedAt?: Date;

  private constructor(props: SupplierProps) {
    this.id = props.id;
    this.name = props.name;
    this.contactName = props.contactName;
    this.address = props.address;
    this.phone = props.phone;
    this.email = props.email;
    this.status = props.status ?? Status.ACTIVE;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(
    props: Omit<SupplierProps, 'id' | 'status' | 'createdAt' | 'updatedAt'>,
  ): Supplier {
    if (!props.name?.trim()) {
      throw new Error('El nombre del proveedor es requerido');
    }

    if (props.email && !isValidEmail(props.email)) {
      throw new Error('El email del proveedor no es válido');
    }

    if (props.phone && !isValidPhone(props.phone)) {
      throw new Error('El teléfono del proveedor no es válido');
    }

    return new Supplier(props);
  }

  static reconstitute(props: SupplierProps): Supplier {
    return new Supplier(props);
  }

  update(
    props: Partial<
      Omit<SupplierProps, 'id' | 'status' | 'createdAt' | 'updatedAt'>
    >,
  ): void {
    if (props.name !== undefined) {
      if (!props.name.trim()) {
        throw new Error('El nombre del proveedor es requerido');
      }
      this.name = props.name;
    }

    if (props.contactName !== undefined) {
      this.contactName = props.contactName;
    }

    if (props.address !== undefined) {
      this.address = props.address;
    }

    if (props.phone !== undefined) {
      if (props.phone && !isValidPhone(props.phone)) {
        throw new Error('El teléfono del proveedor no es válido');
      }
      this.phone = props.phone;
    }

    if (props.email !== undefined) {
      if (props.email && !isValidEmail(props.email)) {
        throw new Error('El email del proveedor no es válido');
      }
      this.email = props.email;
    }
  }

  deactivate(): void {
    this.status = Status.INACTIVE;
  }
}
