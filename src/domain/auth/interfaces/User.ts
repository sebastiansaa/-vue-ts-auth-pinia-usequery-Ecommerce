// Interfaz de usuario autenticado
export interface User {
  id: string
  email: string
  name: string
  role: string
  avatar: string
  password?: string
}
