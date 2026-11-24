import apiClient from "./client";
import type { UpdateSalesOrderInput } from "../types/erp";

export type { UpdateSalesOrderInput, SalesOrderUpdateProduct } from "../types/erp";

export const salesApi = {
  getOrders: () => apiClient.get("/sales") as Promise<any>,
  getOrderById: (id: string) => apiClient.get(`/sales/${id}`) as Promise<any>,
  createOrder: (data: any) => apiClient.post("/sales", data) as Promise<any>,
  updateSalesOrder: (id: string, payload: UpdateSalesOrderInput) =>
    apiClient.put(`/sales/${id}`, payload) as Promise<any>,
  confirmOrder: (id: string) => apiClient.post(`/sales/${id}/confirm`) as Promise<any>,
  deliverOrder: (id: string, data?: any) => apiClient.post(`/sales/${id}/deliver`, data) as Promise<any>,
};
