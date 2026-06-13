import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  ShoppingBag,
  Factory,
  Layers,
  Warehouse,
  BookOpen,
  ClipboardList,
  Users,
  Settings,
  HelpCircle,
} from 'lucide-react'
import type { NavItem, SalesOrder, StatusOption, DateRangeOption } from '../types'

export const erpNavItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'sales', label: 'Sales', icon: ShoppingCart },
  { id: 'purchase', label: 'Purchase', icon: ShoppingBag },
  { id: 'manufacturing', label: 'Manufacturing', icon: Factory },
  { id: 'bom', label: 'BOM', icon: Layers },
  { id: 'inventory', label: 'Inventory', icon: Warehouse },
  { id: 'stock-ledger', label: 'Stock Ledger', icon: BookOpen },
  { id: 'audit-logs', label: 'Audit Logs', icon: ClipboardList },
  { id: 'user-management', label: 'User Management', icon: Users },
]

export const erpFooterNavItems: NavItem[] = [
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'help', label: 'Help', icon: HelpCircle },
]

export const salesOrders: SalesOrder[] = [
  {
    id: '1',
    reference: 'SO-2023-0891',
    date: '24 Oct 2023',
    customerName: 'TechCorp Solutions',
    customerInitials: 'TC',
    customerColor: 'bg-orange-500',
    total: 12450.0,
    status: 'Confirmed',
  },
  {
    id: '2',
    reference: 'SO-2023-0890',
    date: '24 Oct 2023',
    customerName: 'Global Retail Ltd',
    customerInitials: 'GR',
    customerColor: 'bg-blue-500',
    total: 3210.0,
    status: 'Draft',
  },
  {
    id: '3',
    reference: 'SO-2023-0889',
    date: '23 Oct 2023',
    customerName: 'Skyline Logistics',
    customerInitials: 'SL',
    customerColor: 'bg-purple-500',
    total: 5890.0,
    status: 'Partially Delivered',
  },
  {
    id: '4',
    reference: 'SO-2023-0888',
    date: '23 Oct 2023',
    customerName: 'Apex Manufacturing',
    customerInitials: 'AM',
    customerColor: 'bg-emerald-500',
    total: 21300.0,
    status: 'Delivered',
  },
  {
    id: '5',
    reference: 'SO-2023-0887',
    date: '22 Oct 2023',
    customerName: 'Delta Enterprises',
    customerInitials: 'DE',
    customerColor: 'bg-red-500',
    total: 1150.0,
    status: 'Cancelled',
  },
]

export const statusOptions: StatusOption[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'Confirmed', label: 'Confirmed' },
  { value: 'Draft', label: 'Draft' },
  { value: 'Partially Delivered', label: 'Partially Delivered' },
  { value: 'Delivered', label: 'Delivered' },
  { value: 'Cancelled', label: 'Cancelled' },
]

export const dateRangeOptions: DateRangeOption[] = [
  { value: '7', label: 'Last 7 Days' },
  { value: '30', label: 'Last 30 Days' },
  { value: '90', label: 'Last 90 Days' },
  { value: '365', label: 'Last Year' },
]

export const TOTAL_ORDERS = 142
