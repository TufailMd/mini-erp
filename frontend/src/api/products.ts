import { fetchApi } from './client';

export interface ProductData {
  id: string;
  name: string;
  code: string;
  salesPrice: number;
  costPrice: number;
  onHandQty: number;
  reservedQty: number;
  freeToUseQty: number;
  procurementType: 'MTO' | 'MTS';
  procurementMethod: 'Purchase' | 'Manufacturing';
  vendorId?: string;
}

export const productsApi = {
  getAll: () => fetchApi('/products'),
  
  getById: (id: string) => fetchApi(`/products/${id}`),
  
  create: (data: Partial<ProductData>) => fetchApi('/products', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id: string, data: Partial<ProductData>) => fetchApi(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id: string) => fetchApi(`/products/${id}`, {
    method: 'DELETE',
  }),
};
