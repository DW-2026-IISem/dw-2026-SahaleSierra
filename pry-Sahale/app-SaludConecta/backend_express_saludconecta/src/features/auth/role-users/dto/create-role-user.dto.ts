/**
 * Datos de entrada de `POST /api/role-users` — **asignar un rol a un usuario**.
 *
 * Es el primer eslabón de la autorización. Se envía la pareja de identificadores;
 * si la asignación ya existía inactiva, se **reactiva** en lugar de duplicarla
 * (la restricción única `(user_id, role_id)` lo garantiza).
 */
export interface CreateRoleUserDto {
  user_id: number;
  role_id: number;
}
