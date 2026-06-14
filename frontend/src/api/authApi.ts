import apiClient from "./client";

export const authApi = {
  login: (credentials: any) => apiClient.post("/auth/login", credentials) as Promise<any>,
  register: (data: any) => apiClient.post("/auth/register", data) as Promise<any>,
  me: () => apiClient.get("/auth/me") as Promise<any>,
};
