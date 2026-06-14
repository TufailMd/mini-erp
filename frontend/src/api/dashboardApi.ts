import apiClient from "./client";

export const dashboardApi = {
  getMetrics: () => apiClient.get("/dashboard") as Promise<any>,
};
