import apiClient from "./client";
import { BillOfMaterial } from "../types/erp";

export const bomApi = {
  getBoms: () => apiClient.get("/boms") as Promise<any>,
  getBomById: (id: string) => apiClient.get(`/boms/${id}`) as Promise<any>,
  createBom: (data: any) => apiClient.post("/boms", data) as Promise<any>,
  updateBom: (id: string, data: any) => apiClient.put(`/boms/${id}`, data) as Promise<any>,
};
