import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Factory,
  BarChart3,
  FileText,
  Settings,
  Box,
  DollarSign,
  ShoppingBag,
  Truck,
  LayoutGrid,
  AlertTriangle,
} from 'lucide-react'
import type {
  NavSection,
  StatCardData,
  ChartDataPoint,
  PendingOrder,
  StockAlert,
  ActivityItem,
} from '../types'

export const nexusNavSections: NavSection[] = [
  {
    title: 'Main Menu',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'inventory', label: 'Inventory', icon: Package },
      { id: 'sales', label: 'Sales', icon: ShoppingCart },
      { id: 'manufacturing', label: 'Manufacturing', icon: Factory },
      { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    ],
  },
  {
    title: 'Resources',
    items: [
      { id: 'documentation', label: 'Documentation', icon: FileText },
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
  },
]

export const statCards: StatCardData[] = [
  {
    id: 'products',
    label: 'Total Products',
    value: '1,265',
    trend: '+12%',
    trendDirection: 'up',
    icon: Box,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    id: 'inventory',
    label: 'Inventory Value',
    value: '$45.2k',
    trend: '+8.2%',
    trendDirection: 'up',
    icon: DollarSign,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
  },
  {
    id: 'sales',
    label: 'Sales Orders',
    value: '386',
    trend: '-4%',
    trendDirection: 'down',
    icon: ShoppingBag,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    id: 'purchase',
    label: 'Purchase Orders',
    value: '789',
    trend: '+21%',
    trendDirection: 'up',
    icon: Truck,
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
  },
  {
    id: 'mfg',
    label: 'MFG Orders',
    value: '120',
    trend: '0%',
    trendDirection: 'neutral',
    icon: LayoutGrid,
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
  },
  {
    id: 'low-stock',
    label: 'LOW STOCK',
    value: '12',
    trend: '',
    trendDirection: 'neutral',
    icon: AlertTriangle,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    variant: 'alert',
  },
]

export const weeklyChartData: ChartDataPoint[] = [
  { day: 'Mon', base: 40, top: 25 },
  { day: 'Tue', base: 55, top: 30 },
  { day: 'Wed', base: 45, top: 35 },
  { day: 'Thu', base: 60, top: 28 },
  { day: 'Fri', base: 50, top: 40 },
  { day: 'Sat', base: 35, top: 20 },
  { day: 'Sun', base: 30, top: 15 },
]

export const monthlyChartData: ChartDataPoint[] = [
  { day: 'W1', base: 180, top: 120 },
  { day: 'W2', base: 220, top: 140 },
  { day: 'W3', base: 195, top: 155 },
  { day: 'W4', base: 240, top: 130 },
]

export const pendingOrders: PendingOrder[] = [
  {
    id: '1',
    customer: 'TechCorp Solutions',
    items: '4 items',
    total: '$12,450.00',
    status: 'Processing',
  },
  {
    id: '2',
    customer: 'Global Retail Ltd',
    items: '2 items',
    total: '$3,210.00',
    status: 'Processing',
  },
  {
    id: '3',
    customer: 'Skyline Logistics',
    items: '6 items',
    total: '$5,890.00',
    status: 'Pending',
  },
  {
    id: '4',
    customer: 'Apex Manufacturing',
    items: '8 items',
    total: '$21,300.00',
    status: 'Processing',
  },
]

export const stockAlerts: StockAlert[] = [
  {
    id: '1',
    severity: 'critical',
    title: 'Critical Stock Level',
    message: "Product 'LED Panel 60x60' is below threshold (Current: 2)",
  },
  {
    id: '2',
    severity: 'delayed',
    title: 'Delayed Delivery',
    message: 'PO-000954 from Global Suppliers is 2 days overdue.',
  },
]

export const recentActivity: ActivityItem[] = [
  {
    id: '1',
    type: 'sales',
    title: 'New Sales Order SO-2023-0891',
    time: '12 mins ago',
  },
  {
    id: '2',
    type: 'manufacturing',
    title: 'Manufacturing Order MO-0042 Completed',
    time: '45 mins ago',
  },
  {
    id: '3',
    type: 'stock',
    title: 'Low stock alert: Circuit Board X7',
    time: '2 hours ago',
  },
]
