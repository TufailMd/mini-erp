import apiClient from "./client";
import type { PreservedApiRequestConfig } from "./client";
import type {
  CreateCustomerInput,
  CustomerListParams,
  CustomerPagination,
  ErpCustomer,
  UpdateCustomerInput,
} from "../types/erp";

export type {
  CreateCustomerInput,
  CustomerListParams,
  CustomerPagination,
  CustomerType,
  ErpCustomer,
  UpdateCustomerInput,
} from "../types/erp";

export interface CustomerListEnvelope {
  success: boolean;
  data: ErpCustomer[];
  total: number;
  page: number;
  limit?: number;
  totalPages?: number;
  message?: string;
}

export interface CustomerResponseEnvelope {
  success: boolean;
  data: ErpCustomer;
  message?: string;
}

export interface CustomerDeleteResponse {
  success: boolean;
  message: string;
}

const preservedRequest = (
  config: PreservedApiRequestConfig = {},
): PreservedApiRequestConfig => ({
  ...config,
  preserveResponseEnvelope: true,
});

export const customerApi = {
  getCustomers: async (
    params: CustomerListParams = {},
  ): Promise<CustomerPagination> => {
    const response = await apiClient.get(
      "/customers",
      preservedRequest({ params }),
    ) as unknown as CustomerListEnvelope;

    const limit = response.limit ?? params.limit ?? 20;
    return {
      ...response,
      limit,
      totalPages:
        response.totalPages ??
        (typeof response.total === "number"
          ? Math.ceil(response.total / limit)
          : 0),
    };
  },

  getCustomerById: async (id: string): Promise<ErpCustomer> => {
    const response = await apiClient.get(
      `/customers/${id}`,
      preservedRequest(),
    ) as unknown as CustomerResponseEnvelope;
    return response.data;
  },

  createCustomer: async (
    data: CreateCustomerInput,
  ): Promise<ErpCustomer> => {
    const response = await apiClient.post(
      "/customers",
      data,
      preservedRequest(),
    ) as unknown as CustomerResponseEnvelope;
    return response.data;
  },

  updateCustomer: async (
    id: string,
    data: UpdateCustomerInput,
  ): Promise<ErpCustomer> => {
    const response = await apiClient.put(
      `/customers/${id}`,
      data,
      preservedRequest(),
    ) as unknown as CustomerResponseEnvelope;
    return response.data;
  },

  deleteCustomer: async (
    id: string,
  ): Promise<CustomerDeleteResponse> => {
    return await apiClient.delete(
      `/customers/${id}`,
      preservedRequest(),
    ) as unknown as CustomerDeleteResponse;
  },
};
