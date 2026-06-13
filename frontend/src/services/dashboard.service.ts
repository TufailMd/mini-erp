import { api } from './apiClient';
import type { Kpi, SalesPoint, InventoryPoint, ActivityItem, LowStockItem } from '../types/dashboard';

const BASE = '/api/dashboard';

export async function getKpis(): Promise<Kpi[]> {
  return api.get<Kpi[]>(`${BASE}/kpis`);
}

export async function getSalesSeries(): Promise<SalesPoint[]> {
  return api.get<SalesPoint[]>(`${BASE}/sales`);
}

export async function getInventoryTrend(): Promise<InventoryPoint[]> {
  return api.get<InventoryPoint[]>(`${BASE}/inventory`);
}

export async function getActivity(): Promise<ActivityItem[]> {
  return api.get<ActivityItem[]>(`${BASE}/activity`);
}

export async function getLowStock(): Promise<LowStockItem[]> {
  return api.get<LowStockItem[]>(`${BASE}/low-stock`);
}

export default {
  getKpis,
  getSalesSeries,
  getInventoryTrend,
  getActivity,
  getLowStock,
};
