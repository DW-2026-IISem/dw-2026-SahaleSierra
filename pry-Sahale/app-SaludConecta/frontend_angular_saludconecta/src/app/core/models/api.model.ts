export type Status = 'active' | 'inactive';
export type Money = number | string;

export interface ApiError {
  error: string;
  detail?: string;
}

/** Firma mínima de los objetos Sequelize que devuelve el backend. */
export interface Timestamps {
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Payload de edición (PUT/PATCH): sin `status`. El estado solo cambia con
 * `PATCH /:id/deactivate`; el formulario de edición nunca lo envía.
 */
export type UpdatePayload<T> = Partial<Omit<T, 'status'>>;

export function toNumber(value: Money | null | undefined): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}
