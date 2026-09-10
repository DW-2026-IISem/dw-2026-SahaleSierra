export interface AuthenticatedUser {
  id: number;
  email: string;
  username: string;
  roles: string[];
}
