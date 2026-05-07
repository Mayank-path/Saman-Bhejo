import api from "./axios"
import type { ApiResponse, User, AuthTokens } from "../types"

export const authApi = {
  register: (data: {
    name:     string
    email:    string
    phone:    string
    password: string
    role:     string
  }) => api.post<ApiResponse<{ user: User, tokens: AuthTokens }>>("/auth/register", data),

  login: (data: { email: string, password: string }) =>
    api.post<ApiResponse<{ user: User, tokens: AuthTokens }>>("/auth/login", data),

  getMe: () =>
    api.get<ApiResponse<User>>("/auth/me"),

  logout: () =>
    api.post("/auth/logout"),
}