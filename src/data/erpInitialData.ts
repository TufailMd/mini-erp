import { ErpProduct, BillOfMaterial, SalesOrder, PurchaseOrder, ManufacturingOrder, StockLedgerEntry } from '../types/erp'

export const initialProducts: ErpProduct[] = [
  { id: 'PRD-001', name: 'Wooden Dining Table', code: 'WDT-01', salesPrice: 15000, costPrice: 8000, onHandQty: 5, reservedQty: 0, procurementType: 'MTO', procurementMethod: 'Manufacturing' },
  { id: 'PRD-002', name: 'Office Chair', code: 'OCH-02', salesPrice: 5000, costPrice: 2500, onHandQty: 50, reservedQty: 10, procurementType: 'MTS', procurementMethod: 'Purchase', defaultVendorId: 'VEN-001' },
  { id: 'PRD-003', name: 'Wooden Legs', code: 'WL-01', salesPrice: 500, costPrice: 200, onHandQty: 100, reservedQty: 0, procurementType: 'MTS', procurementMethod: 'Purchase', defaultVendorId: 'VEN-002' },
  { id: 'PRD-004', name: 'Wooden Top', code: 'WT-01', salesPrice: 3000, costPrice: 1500, onHandQty: 20, reservedQty: 0, procurementType: 'MTS', procurementMethod: 'Purchase', defaultVendorId: 'VEN-002' },
  { id: 'PRD-005', name: 'Steel Screws (Pack)', code: 'SCR-100', salesPrice: 100, costPrice: 40, onHandQty: 500, reservedQty: 0, procurementType: 'MTS', procurementMethod: 'Purchase', defaultVendorId: 'VEN-003' },
]

export const initialBoms: BillOfMaterial[] = [
  {
    id: 'BOM-001',
    reference: 'BOM-WDT-01',
    productId: 'PRD-001',
    components: [
      { productId: 'PRD-003', quantity: 4 }, // 4 legs
      { productId: 'PRD-004', quantity: 1 }, // 1 top
      { productId: 'PRD-005', quantity: 12 }, // 12 screws
    ]
  }
]

export const initialSalesOrders: SalesOrder[] = [
  {
    id: 'SO-001',
    reference: 'SO-2024-001',
    customerName: 'TechCorp India',
    status: 'Confirmed',
    items: [
      { id: 'SOI-1', productId: 'PRD-002', quantity: 10, price: 5000 }
    ],
    totalAmount: 50000,
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
]

export const initialPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'PO-001',
    reference: 'PO-2024-001',
    vendorId: 'VEN-001',
    status: 'Completed',
    items: [
      { id: 'POI-1', productId: 'PRD-002', quantity: 50, price: 2500 }
    ],
    totalAmount: 125000,
    createdAt: new Date(Date.now() - 172800000).toISOString()
  }
]

export const initialManufacturingOrders: ManufacturingOrder[] = []

export const initialStockLedger: StockLedgerEntry[] = [
  {
    id: 'LED-001',
    date: new Date(Date.now() - 172800000).toISOString(),
    productId: 'PRD-002',
    movementType: 'In',
    quantity: 50,
    reference: 'PO-001'
  }
]
