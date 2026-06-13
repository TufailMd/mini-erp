import { Cpu, Radio, Headphones, Square } from 'lucide-react'
import type { Product, ProductStatCardData, ActiveFilter } from '@/types'

export const productStatCards: ProductStatCardData[] = [
  {
    id: '1',
    label: 'Total Products',
    value: '1,284',
    subValue: '+12%',
    subValueClass: 'text-green-600',
    variant: 'default',
  },
  {
    id: '2',
    label: 'Low Stock Alert',
    value: '24',
    subValue: 'CRITICAL',
    subValueClass:
      'bg-red-100 text-red-600 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full',
    variant: 'critical',
  },
  {
    id: '3',
    label: 'Inventory Value',
    value: '₹2.4M',
    subValue: '~₹14k today',
    subValueClass: 'text-slate-500',
    variant: 'money',
  },
  {
    id: '4',
    label: 'Procurement Efficiency',
    value: '94.2%',
    subValue: 'Top Decile',
    subValueClass: 'text-slate-500',
    variant: 'efficiency',
  },
]

export const defaultFilters: ActiveFilter[] = [
  { id: '1', label: 'Vendor', values: ['Global Logistics', 'TechHub'] },
  { id: '2', label: 'Procurement', values: ['Internal', 'Outsourced'] },
]

export const products: Product[] = [
  {
    id: '1',
    reference: 'PRD-1001',
    name: 'Industrial Hub',
    version: 'v2.0',
    category: 'Electronics / Network',
    sku: 'HUB-20-X1',
    salesPrice: 2450.0,
    costPrice: 1200.0,
    onHand: 412,
    freeToUse: 380,
    status: 'In Stock',
    imageBg: 'bg-slate-900',
    imageIcon: Cpu,
    procureOnDemand: true,
    procurementType: 'Purchase',
    vendor: 'Global Logistics',
  },
  {
    id: '2',
    reference: 'PRD-1002',
    name: 'Precision Sensor G9',
    category: 'Components / Laser',
    sku: 'SEN-G9-RED',
    salesPrice: 125.0,
    costPrice: 48.5,
    onHand: 12,
    freeToUse: 4,
    status: 'Low Stock',
    imageBg: 'bg-red-800',
    imageIcon: Radio,
    procureOnDemand: true,
    procurementType: 'Manufacturing',
    bom: 'BOM-000001',
  },
  {
    id: '3',
    reference: 'PRD-1003',
    name: 'Audio Interface Pro',
    category: 'Electronics / Media',
    sku: 'AUD-PR-2X2',
    salesPrice: 399.0,
    costPrice: 215.0,
    onHand: 84,
    freeToUse: 82,
    status: 'In Stock',
    imageBg: 'bg-slate-800',
    imageIcon: Headphones,
    procureOnDemand: false,
  },
  {
    id: '4',
    reference: 'PRD-1004',
    name: 'Steel Chassis Frame',
    category: 'Raw Materials / Metals',
    sku: 'MAT-STEEL-01',
    salesPrice: 0.0,
    costPrice: 42.0,
    onHand: 1250,
    freeToUse: 1100,
    status: 'Internal Use',
    imageBg: 'bg-indigo-100',
    imageIcon: Square,
    procureOnDemand: false,
  },
]

export const TOTAL_PRODUCTS = 1284
export const PRODUCTS_PAGE_SIZE = 4
