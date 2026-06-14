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
} from 'lucide-react'
import type { NavItem } from '@/types'

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

export const erpFooterNavItems: NavItem[] = []
