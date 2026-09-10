import { PaginatedResult } from '../../../../../common/interfaces/pagination.interface.js';
import { Client } from '../entities/client.entity.js';

export const CLIENT_REPOSITORY = 'CLIENT_REPOSITORY';

export interface ClientFindAllParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface IClientRepository {
  create(client: Client): Promise<Client>;
  update(client: Client): Promise<Client>;
  delete(id: number): Promise<void>;
  findById(id: number): Promise<Client | null>;
  findByEmail(email: string): Promise<Client | null>;
  findAll(params: ClientFindAllParams): Promise<PaginatedResult<Client>>;
}
