import apiClient from "./client";
import { StockLedgerEntry } from "../types/erp";

export const inventoryApi = {
  getStockLedger: () => apiClient.get("/stock-ledger") as Promise<any>,
  getInventoryLevels: () => apiClient.get("/inventory") as Promise<any>,
};
