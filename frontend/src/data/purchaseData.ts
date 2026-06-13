import type { VendorStatCardData, Vendor, VendorMetric, VendorActivityItem } from '@/types'

export const vendorStatCards: VendorStatCardData[] = [
  {
    id: '1',
    label: 'Total Vendors',
    value: '1,265',
    sub: '+12%',
    subClass: 'text-green-600',
    iconClass: 'bg-indigo-100 text-indigo-600',
  },
  {
    id: '2',
    label: 'Active POs',
    value: '356',
    sub: 'Active now',
    subClass: 'text-slate-500',
    iconClass: 'bg-amber-100 text-amber-600',
  },
  {
    id: '3',
    label: 'Avg Lead Time',
    value: '4.2d',
    sub: '~0.5d',
    subClass: 'text-red-500',
    iconClass: 'bg-red-100 text-red-600',
  },
  {
    id: '4',
    label: 'Quality Score',
    value: '94.8%',
    sub: '★ Top Tier',
    subClass: 'text-green-600',
    iconClass: 'bg-green-100 text-green-600',
  },
]

export const vendors: Vendor[] = [
  {
    id: '1',
    name: 'Swift Industries Ltd.',
    code: 'VND-2024-001',
    initials: 'SI',
    initialsBg: 'bg-purple-600',
    contactPerson: 'Robert Harrison',
    email: 'robert@swiftind.com',
    phone: '+44 20 7946 0123',
    category: 'Manufacturing',
  },
  {
    id: '2',
    name: 'Nexus Logistics',
    code: 'VND-2024-042',
    initials: 'NL',
    initialsBg: 'bg-blue-500',
    contactPerson: 'Sarah Connor',
    email: 'sarah.c@nexuslog.net',
    phone: '+1 555 0199',
    category: 'Logistics',
  },
  {
    id: '3',
    name: 'Precision Steel Co.',
    code: 'VND-2024-015',
    initials: 'PS',
    initialsBg: 'bg-teal-500',
    contactPerson: 'David Miller',
    email: 'd.miller@precision.com',
    phone: '+49 89 2311 0',
    category: 'Raw Material',
  },
  {
    id: '4',
    name: 'Sky Tech',
    code: 'VND-2024-087',
    initials: 'ST',
    initialsBg: 'bg-orange-500',
    contactPerson: 'Elena',
    email: 'elena@skytech.io',
    phone: '+1 555 8877',
    category: 'Technology',
  },
]

export const vendorMetrics: VendorMetric[] = [
  {
    label: 'Lead Time',
    value: '3.8 Days',
    sub: 'Excellent Performance',
    valueClass: 'text-slate-900',
  },
  {
    label: 'Quality Rating',
    value: '98.2%',
    sub: 'ISO 9001 Compliant',
    valueClass: 'text-green-600',
  },
  {
    label: 'In-Full Delivery',
    value: '95.4%',
    sub: 'Target: 96%',
    valueClass: 'text-amber-600',
  },
  {
    label: 'Risk Index',
    value: 'Low',
    sub: 'Quarterly Audit Passed',
    valueClass: 'text-green-600',
  },
]

export const vendorActivity: VendorActivityItem[] = [
  {
    id: '1',
    text: 'New price list uploaded by Swift Industries Ltd.',
    detail: '2 hours ago · PL-2024-X12',
    dotColor: 'bg-blue-500',
  },
  {
    id: '2',
    text: 'Quality audit passed for Nexus Logistics',
    detail: 'Yesterday 14:20 · Score 98/100',
    dotColor: 'bg-green-500',
  },
]

export const TOTAL_VENDORS = 1265
export const VENDORS_PAGE_SIZE = 10
