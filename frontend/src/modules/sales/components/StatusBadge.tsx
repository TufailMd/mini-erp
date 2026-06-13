import type { OrderStatus } from '@/types'

interface StatusBadgeProps {
  status: OrderStatus
}

const statusStyles: Record<OrderStatus, string> = {
  Confirmed: 'bg-indigo-100 text-indigo-700',
  Draft: 'bg-sky-100 text-sky-700',
  'Partially Delivered': 'bg-orange-100 text-orange-700',
  Delivered: 'bg-emerald-100 text-emerald-700',
  Cancelled: 'bg-red-100 text-red-700',
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[status]}`}
    >
      {status}
    </span>
  )
}
