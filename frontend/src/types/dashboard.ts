export type Kpi = {
  id?: string;
  title: string;
  value: string | number;
  change?: string;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
};

export type SalesPoint = {
  x: string; // date or label
  y: number; // value
};

export type InventoryPoint = {
  x: string;
  stock: number;
};

export type ActivityItem = {
  id: string;
  title: string;
  detail?: string;
  time?: string;
};

export type LowStockItem = {
  id?: string;
  name: string;
  sku?: string;
  stock: number;
  reorderLevel?: number;
};
