import apiClient from "./client";

export const manufacturingApi = {
  getOrders: () => apiClient.get("/manufacturing") as Promise<any>,
  getOrderById: (id: string) => apiClient.get(`/manufacturing/${id}`) as Promise<any>,
  createOrder: (data: any) => apiClient.post("/manufacturing", data) as Promise<any>,
  updateOrder: (id: string, data: any) => apiClient.put(`/manufacturing/${id}`, data) as Promise<any>,
  confirmOrder: (id: string) => apiClient.post(`/manufacturing/${id}/confirm`) as Promise<any>,
  startOrder: (id: string) => apiClient.post(`/manufacturing/${id}/start`) as Promise<any>,
  completeOrder: (id: string, data?: any) => apiClient.post(`/manufacturing/${id}/produce`, data) as Promise<any>,
  cancelOrder: (id: string) => apiClient.post(`/manufacturing/${id}/cancel`) as Promise<any>,
  deleteOrder: (id: string) => apiClient.delete(`/manufacturing/${id}`) as Promise<any>,
};
