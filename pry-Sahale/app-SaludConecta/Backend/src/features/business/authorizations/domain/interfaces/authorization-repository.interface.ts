import { Authorization } from '../entities/authorization.entity.js';
import type { PaginationParams } from '../../../../../common/interfaces/pagination.interface.js';

export interface AuthorizationFilter {
  appointmentId?: number;
  status?: string;
}

export const AUTHORIZATION_REPOSITORY = 'AUTHORIZATION_REPOSITORY';

export interface AuthorizationRepository {
  create(authorization: Authorization): Promise<Authorization>;
  findById(id: number): Promise<Authorization | null>;
  findByAppointmentId(appointmentId: number): Promise<Authorization | null>;
  findAll(
    filter: AuthorizationFilter,
    pagination: PaginationParams,
  ): Promise<{ data: Authorization[]; total: number }>;
  update(id: number, authorization: Authorization): Promise<Authorization>;
  delete(id: number): Promise<void>;
}
