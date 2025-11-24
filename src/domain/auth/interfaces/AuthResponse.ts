// interface de la respuesta de autenticación
import type { User } from './User'

//Es exactamente la respuesta del BE. Usar sólo al recibir datos desde la API antes de mapearlos.
export interface AuthResponseRaw {
  access_token: string;
  refresh_token: string;
  user?: User
}

// Interfaz usada en la aplicación después de mapear los datos crudos.
export interface AuthTokens {
  accessToken: string;
  refreshToken: string
}

// Interfaz de la respuesta de autenticación usada en la app
export interface AuthResponse {
  tokens: AuthTokens;
  user?: User
}
