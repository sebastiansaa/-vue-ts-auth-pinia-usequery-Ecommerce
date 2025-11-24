import type { AuthResponse } from "./AuthResponse"

export interface AuthClient {
  login(
    email: string,
    password: string): Promise<AuthResponse>

  register(
    name: string,
    email: string,
    password: string): Promise<AuthResponse>

  loginWithGoogle(
    token: string
  ): Promise<AuthResponse>

  loginWithFacebook(
    token: string
  ): Promise<AuthResponse>
}
