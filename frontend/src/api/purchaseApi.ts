import apiClient from "./client";

export const purchaseApi = {
  getOrders: () => apiClient.get("/purchase") as Promise<any>,
  getOrderById: (id: string) => apiClient.get(`/purchase/${id}`) as Promise<any>,
  createOrder: (data: any) => apiClient.post("/purchase", data) as Promise<any>,
  confirmOrder: (id: string) => apiClient.post(`/purchase/${id}/confirm`) as Promise<any>,
  receiveOrder: (id: string, data?: any) => apiClient.post(`/purchase/${id}/receive`, data) as Promise<any>,
};
