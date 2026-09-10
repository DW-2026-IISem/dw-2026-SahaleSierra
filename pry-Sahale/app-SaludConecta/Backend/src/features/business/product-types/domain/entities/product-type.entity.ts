import { Status } from '../../../../../common/enums/status.enum.js';

export interface ProductTypeProps {
  id?: number;
  name: string;
  description?: string;
  status?: Status;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ProductType {
  id?: number;
  name: string;
  description?: string;
  status: Status;
  createdAt?: Date;
  updatedAt?: Date;

  private constructor(props: ProductTypeProps) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.status = props.status ?? Status.ACTIVE;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(
    props: Omit<ProductTypeProps, 'id' | 'status' | 'createdAt' | 'updatedAt'>,
  ): ProductType {
    if (!props.name?.trim()) {
      throw new Error('El nombre del tipo de producto es requerido');
    }

    return new ProductType(props);
  }

  static reconstitute(props: ProductTypeProps): ProductType {
    return new ProductType(props);
  }

  update(
    props: Partial<
      Omit<ProductTypeProps, 'id' | 'status' | 'createdAt' | 'updatedAt'>
    >,
  ): void {
    if (props.name !== undefined) {
      if (!props.name.trim()) {
        throw new Error('El nombre del tipo de producto es requerido');
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
