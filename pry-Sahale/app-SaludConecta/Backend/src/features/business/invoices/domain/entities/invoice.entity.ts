export enum InvoiceStatus {
  PENDING = 'PENDIENTE',
  PAID = 'PAGADA',
  CANCELLED = 'ANULADA',
}

export interface InvoiceProps {
  id?: number;
  number: string;
  date: Date;
  subtotal: number;
  tax: number;
  total: number;
  status?: InvoiceStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Invoice {
  id?: number;
  number: string;
  date: Date;
  subtotal: number;
  tax: number;
  total: number;
  status: InvoiceStatus;
  createdAt?: Date;
  updatedAt?: Date;

  private constructor(props: InvoiceProps) {
    this.id = props.id;
    this.number = props.number;
    this.date = props.date;
    this.subtotal = props.subtotal;
    this.tax = props.tax;
    this.total = props.total;
    this.status = props.status ?? InvoiceStatus.PENDING;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(props: Omit<InvoiceProps, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Invoice {
    if (!props.number?.trim()) throw new Error('El número de factura es requerido');
    if (props.subtotal < 0) throw new Error('El subtotal no puede ser negativo');
    if (props.tax < 0) throw new Error('El impuesto no puede ser negativo');
    if (props.total < 0) throw new Error('El total no puede ser negativo');
    return new Invoice(props);
  }

  static reconstitute(props: InvoiceProps): Invoice {
    return new Invoice(props);
  }

  markPaid(): void {
    if (this.status !== InvoiceStatus.PENDING) {
      throw new Error('Solo una factura pendiente puede marcarse como pagada');
    }
    this.status = InvoiceStatus.PAID;
  }

  cancel(): void {
    if (this.status === InvoiceStatus.PAID) {
      throw new Error('Una factura pagada no puede anularse');
    }
    this.status = InvoiceStatus.CANCELLED;
  }
}
