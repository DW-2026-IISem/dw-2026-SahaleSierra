import { Status, Timestamps } from './api.model';

/** Tabla `users` — /api/users. Nunca incluye `password`. */
export interface User extends Timestamps {
  id: number;
  username: string; // el backend lo guarda en minúsculas
  email: string; // idem
  avatar: string | null;
  status: Status;
}

export interface UserPayload {
  username: string;
  email: string;
  /** Obligatorio al crear; opcional al editar. */
  password?: string;
  avatar?: string | null;
  status?: Status;
}

/** PATCH /api/users/:id/password */
export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
}
