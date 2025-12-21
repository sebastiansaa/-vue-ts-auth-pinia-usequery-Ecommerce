import { axiosAdapter } from "@/shared/api/axiosAdapter";
import type { AuthResponseRaw, AuthResponse } from "../interfaces/AuthResponse";
import type { User } from "../interfaces/User";

function mapAuthResponse(raw: AuthResponseRaw): AuthResponse {
  return {
    tokens: {
      accessToken: raw.access_token,
      refreshToken: raw.refresh_token,
    },
    user: raw.user as User | undefined,
  };
}

export async function login(email: string, password: string)
  : Promise<AuthResponse> {
  const response = await axiosAdapter.post<AuthResponseRaw>("/auth/login", { email, password });
  return mapAuthResponse(response.data);//Devuelves response.data (ya mapeado), no el axiosResponse entero
}

// Obtener el perfil del usuario autenticado
export async function profile(): Promise<User> {
  const response = await axiosAdapter.get<User>("/auth/profile");
  return response.data;
}

// Refrescar tokens
export async function refreshToken(refreshToken: string)
  : Promise<AuthResponse> {
  const response = await axiosAdapter.post<AuthResponseRaw>("/auth/refresh-token", { refresh_token: refreshToken });
  return mapAuthResponse(response.data);
}
