import type {
  WorkCenter,
  KanbanColumnData,
  ManufacturingOrder,
} from '../types'

export const workCenters: WorkCenter[] = [
  {
    id: 'assembly-a',
    name: 'Assembly Line A',
    loadPercent: 85,
    status: 'RUNNING',
    barColor: 'bg-indigo-500',
    badgeClass: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: 'cnc',
    name: 'CNC Machining',
    loadPercent: 92,
    status: 'HIGH LOAD',
    barColor: 'bg-orange-500',
    badgeClass: 'bg-orange-100 text-orange-700',
  },
  {
    id: 'qa',
    name: 'Quality Assurance',
    loadPercent: 20,
    status: 'IDLE',
    barColor: 'bg-emerald-500',
    badgeClass: 'bg-emerald-50 text-emerald-600',
  },
]

const draftOrders: ManufacturingOrder[] = [
  {
    id: 'mo-089',
    reference: 'MO-2024-089',
    title: 'Industrial Motor Housing Unit V2',
    bom: 'BOM-1102',
    quantity: 50,
    columnId: 'draft',
    assigneeInitials: 'AG',
    assigneeColor: 'bg-slate-300',
    hasCheck: true,
  },
  {
    id: 'mo-088',
    reference: 'MO-2024-088',
    title: 'Hydraulic Pump Assembly Kit',
    bom: 'BOM-1098',
    quantity: 25,
    columnId: 'draft',
    assigneeInitials: 'MR',
    assigneeColor: 'bg-slate-400',
    hasCheck: true,
  },
]

const plannedOrders: ManufacturingOrder[] = [
  {
    id: 'mo-087',
    reference: 'MO-2024-087',
    title: 'Precision Steel Bearings Set',
    bom: 'BOM-0944',
    quantity: 2500,
    columnId: 'planned',
    assigneeInitials: 'JD',
    assigneeColor: 'bg-indigo-500',
    badge: 'TOMORROW',
    badgeClass: 'bg-sky-100 text-sky-700',
    hasWarning: true,
  },
]

const inProgressOrders: ManufacturingOrder[] = [
  {
    id: 'mo-085',
    reference: 'MO-2024-085',
    title: 'Custom Aluminum Extrusion Profile X-7',
    bom: 'BOM-0881',
    quantity: 120,
    columnId: 'in-progress',
    workCenter: 'Assembly Line A',
    progress: 65,
    assigneeInitials: 'SK',
    assigneeColor: 'bg-amber-600',
    timeRemaining: '4h 30m',
    hasInfo: true,
    featured: true,
  },
  {
    id: 'mo-084',
    reference: 'MO-2024-084',
    title: 'Stainless Steel Valve Body',
    bom: 'BOM-0875',
    quantity: 200,
    columnId: 'in-progress',
    workCenter: 'CNC Machining',
    progress: 40,
    assigneeInitials: 'LP',
    assigneeColor: 'bg-indigo-500',
    timeRemaining: '6h 15m',
  },
  {
    id: 'mo-083',
    reference: 'MO-2024-083',
    title: 'PCB Control Module Rev C',
    bom: 'BOM-0862',
    quantity: 500,
    columnId: 'in-progress',
    workCenter: 'Assembly Line A',
    progress: 88,
    assigneeInitials: 'TN',
    assigneeColor: 'bg-emerald-600',
    timeRemaining: '1h 45m',
    hasInfo: true,
  },
]

export const kanbanColumns: KanbanColumnData[] = [
  {
    id: 'draft',
    title: 'Draft',
    iconColor: 'text-sky-500',
    countBadgeClass: 'bg-sky-100 text-sky-700',
    orders: draftOrders,
  },
  {
    id: 'planned',
    title: 'Planned',
    iconColor: 'text-indigo-500',
    countBadgeClass: 'bg-indigo-100 text-indigo-700',
    orders: plannedOrders,
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    iconColor: 'text-orange-500',
    countBadgeClass: 'bg-orange-100 text-orange-700',
    columnBorder: 'border-t-2 border-t-orange-400',
    orders: inProgressOrders,
  },
]

export const allManufacturingOrders: ManufacturingOrder[] = [
  ...draftOrders,
  ...plannedOrders,
  ...inProgressOrders,
]
