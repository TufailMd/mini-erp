import apiClient from "./client";

export const userApi = {
  getUsers: () => apiClient.get("/users") as Promise<any>,
  getUserById: (id: string) => apiClient.get(`/users/${id}`) as Promise<any>,
  createUser: (data: any) => apiClient.post("/users", data) as Promise<any>,
  updateUser: (id: string, data: any) => apiClient.put(`/users/${id}`, data) as Promise<any>,
  deleteUser: (id: string) => apiClient.delete(`/users/${id}`) as Promise<any>,
};
