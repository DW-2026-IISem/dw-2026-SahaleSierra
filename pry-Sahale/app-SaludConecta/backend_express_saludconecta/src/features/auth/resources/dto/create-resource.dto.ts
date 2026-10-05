/**
 * Datos de entrada de `POST /api/resources`.
 *
 * `path` se guarda con el patrón (`/api/patients/:id`), no con un valor concreto.
 */
export interface CreateResourceDto {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  description?: string | null;
  status?: "active" | "inactive";
}
