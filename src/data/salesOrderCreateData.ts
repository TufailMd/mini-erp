import type { SalesOrderCreateData } from '../types'

export const salesOrderCreateData: SalesOrderCreateData = {
  reference: 'SAL-2024-0892',
  status: 'Draft',
  customerName: 'Global Solutions Inc.',
  orderDate: '20-05-2024',
  billingAddress:
    '4529 Industrial Parkway, Suite 400, Austin, TX 78701, United States',
  assignedUser: {
    name: 'Alex Sterling',
    initials: 'AS',
    role: 'Senior Account Executive',
  },
  stockReadiness: 82,
  stockReadinessTrend: '+12% vs last order',
  lineItems: [
    {
      id: '1',
      rowNum: 1,
      product: 'Industrial Power Module V4',
      sku: 'IND-PM-V4-99',
      orderedQty: 100.0,
      deliveredQty: 0.0,
      unitPrice: 450.0,
      total: 45000.0,
    },
    {
      id: '2',
      rowNum: 2,
      product: 'High-Tensile Steel Housing',
      sku: 'HTS-HS-902',
      orderedQty: 25.0,
      deliveredQty: 0.0,
      unitPrice: 1200.0,
      total: 30000.0,
    },
  ],
  subtotal: 75000.0,
  taxRate: 10,
  taxAmount: 7500.0,
  total: 82500.0,
  attachmentCount: 1,
}

export const customerOptions = [
  'Global Solutions Inc.',
  'Acme Corp',
  'TechCorp Solutions',
  'Skyline Logistics',
  'Apex Manufacturing',
]

export const salesRepOptions = [
  'Alex Sterling',
  'John Smith',
  'Jane Doe',
  'Sarah Williams',
]
