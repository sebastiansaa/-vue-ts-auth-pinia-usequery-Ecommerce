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

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await axiosAdapter.post<AuthResponseRaw>("/auth/login", { email, password });
  return mapAuthResponse(response.data);
}

