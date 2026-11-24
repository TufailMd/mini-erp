export type ProcurementType = 'MTO' | 'MTS'
export type ProcurementMethod = 'Purchase' | 'Manufacturing'

export type CustomerType = 'INDIVIDUAL' | 'BUSINESS'

export interface ErpCustomer {
  _id: string
  customer_code: string
  name: string
  normalized_name: string
  customer_type: CustomerType
  email?: string | null
  phone?: string | null
  alternate_phone?: string | null
  billing_address?: string | null
  shipping_address?: string | null
  city?: string | null
  state?: string | null
  postal_code?: string | null
  country?: string | null
  company_name?: string | null
  tax_id?: string | null
  gst_number?: string | null
  is_active: boolean
  notes?: string | null
  created_by?: string | null
  createdAt?: string
  updatedAt?: string
}

export interface CustomerListParams {
  search?: string
  customer_type?: CustomerType
  is_active?: boolean | 'true' | 'false'
  page?: number
  limit?: number
}

export interface CustomerPagination {
  data: ErpCustomer[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface CreateCustomerInput {
  name: string
  customer_type?: CustomerType
  email?: string
  phone?: string
  alternate_phone?: string
  billing_address?: string
  shipping_address?: string
  city?: string
  state?: string
  postal_code?: string
  country?: string
  company_name?: string
  tax_id?: string
  gst_number?: string
  is_active?: boolean
  notes?: string
}

export type UpdateCustomerInput = Partial<CreateCustomerInput>

export interface ErpProduct {
  id: string
  name: string
  code: string
  salesPrice: number
  costPrice: number
  onHandQty: number
  reservedQty: number
  freeToUseQty: number
  procurementType: ProcurementType
  procurementMethod: ProcurementMethod
  vendorId?: string
  imageUrl?: string
}

export type OrderStatus = 'Draft' | 'Confirmed' | 'Partially Processed' | 'Completed' | 'Cancelled'

export interface OrderItem {
  id: string
  productId: string
  quantity: number
  price: number
}

export interface SalesOrder {
  id: string
  reference: string
  customerName: string
  status: OrderStatus
  items: OrderItem[]
  totalAmount: number
  createdAt: string
}

export interface SalesOrderUpdateProduct {
  product_id: string
  ordered_quantity: number
  units?: string
  sales_unit_price?: number
}

export interface UpdateSalesOrderInput {
  customer?: string
  customer_address?: string
  sales_person?: string
  products?: SalesOrderUpdateProduct[]
}

export interface PurchaseOrder {
  id: string
  reference: string
  vendorId: string
  status: OrderStatus
  items: OrderItem[]
  totalAmount: number
  createdAt: string
}

export interface ManufacturingOrder {
  id: string
  reference: string
  productId: string
  quantityToProduce: number
  status: OrderStatus
  bomId?: string
  createdAt: string
}

export interface BomComponent {
  productId: string
  quantity: number
}

export interface BillOfMaterial {
  id: string
  reference: string
  productId: string
  components: BomComponent[]
}

export interface StockLedgerEntry {
  id: string
  date: string
  productId: string
  movementType: 'In' | 'Out'
  quantity: number
  balance: number
  reference: string // e.g., 'SO-001' or 'MO-002'
}
