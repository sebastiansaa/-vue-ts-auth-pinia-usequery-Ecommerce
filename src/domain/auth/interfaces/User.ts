// Interfaz de usuario autenticado (DTO expuesto por el backend auth/user)
export interface User {
  id: string;
  email: string;
  name?: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}
