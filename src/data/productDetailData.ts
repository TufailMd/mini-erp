import type { ProductDetailData } from '../types'

export const productDetailData: ProductDetailData = {
  reference: 'BOM-000001',
  productName: 'Door Frames',
  salesPrice: 10.0,
  costPrice: 8.0,
  isDraft: true,
  inventory: [
    {
      label: 'On Hand Quantity',
      value: '50.00',
      unit: 'Units',
      valueColor: 'text-slate-900',
      breakdown: [
        { label: '+ Received (PO)', value: '+12.00', isPositive: true },
        { label: '- Delivered (SO)', value: '-2.00', isPositive: false },
      ],
    },
    {
      label: 'Free to Use Qty',
      value: '42.00',
      unit: 'Units',
      valueColor: 'text-green-600',
      hasInfo: true,
      breakdown: [
        { label: 'On Hand', value: '50.00' },
        { label: '- Reserved (Confirmed)', value: '8.00', isPositive: false },
      ],
    },
  ],
  procurement: {
    procureOnDemand: true,
    procurementType: 'Purchase',
    vendor: 'Steel Works Ltd.',
    vendorOptions: [
      'Steel Works Ltd.',
      'Global Logistics',
      'TechHub Supplies',
      'Apex Manufacturing',
    ],
    bomOptions: [
      'BOM-000001',
      'BOM-000002',
    ]
  },
  record: {
    lifecycle: 'Active',
    lastAudit: '2 hours ago',
    createdBy: 'A. Administrator',
    inventoryHealth: 84,
    healthDescription:
      '84% of required component stock available in Main Warehouse.',
  },
  logs: [
    {
      id: '1',
      title: 'Sales Price updated',
      detail: '₹9.50 → ₹10.00 by John D.',
      time: 'Today, 11:24 AM',
    },
  ],
  productImagePath: '',
}
