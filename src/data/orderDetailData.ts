import type { SalesOrderDetail } from '../types'

export const salesOrderDetail: SalesOrderDetail = {
  id: 'SO-00001',
  reference: 'SO-00001',
  status: 'Draft',
  customerName: 'Acme Corp',
  billingAddress: '123 Corporate Blvd, Tech District, Cityville',
  orderDate: '27-10-2023',
  salesPerson: 'John Smith',
  lineItems: [
    {
      id: '1',
      product: 'Industrial Widget',
      orderedQty: 50,
      deliveredQty: 0,
      costPrice: 12.0,
      salesPrice: 20.0,
      total: 1000.0,
    },
    {
      id: '2',
      product: 'Steel Bracket Pro',
      orderedQty: 200,
      deliveredQty: 0,
      costPrice: 4.5,
      salesPrice: 8.0,
      total: 1600.0,
    },
  ],
  subtotal: 2600.0,
  taxRate: 10,
  taxAmount: 260.0,
  total: 2860.0,
  timeline: [
    {
      id: '1',
      label: 'Created',
      description: 'Today, 10:42 AM by Admin',
      status: 'completed',
    },
    {
      id: '2',
      label: 'Draft',
      description: 'Pending confirmation',
      status: 'current',
    },
    {
      id: '3',
      label: 'Delivery',
      description: 'Not started',
      status: 'pending',
    },
    {
      id: '4',
      label: 'Invoiced',
      description: 'Not generated',
      status: 'pending',
    },
  ],
  recentActivity: [
    {
      id: '1',
      title: 'Field Updated',
      description: 'Customer Name changed',
    },
    {
      id: '2',
      title: 'Record Created',
      description: 'Sales Order SO-00001 initiated by John Smith.',
    },
  ],
}

export const salesPersonOptions = [
  'John Smith',
  'Jane Doe',
  'Alex Johnson',
  'Sarah Williams',
]
