import {
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
} from 'lucide-react'
import type { ManufacturingOrder } from '@/types'

interface KanbanCardProps {
  order: ManufacturingOrder
  onClick: () => void
}

export default function KanbanCard({ order, onClick }: KanbanCardProps) {
  const isInProgress = order.columnId === 'in-progress'

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-lg border bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md ${
        order.featured
          ? 'border-orange-200 border-t-4 border-t-orange-400'
          : 'border-slate-200'
      }`}
    >
      <p className="text-sm font-bold text-indigo-600">{order.reference}</p>
      <p className="mt-1 text-sm font-medium leading-snug text-slate-800">
        {order.title}
      </p>

      {isInProgress && order.workCenter && (
        <p className="mt-2 text-xs text-slate-500">{order.workCenter}</p>
      )}

      {!isInProgress && (
        <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
          <span>{order.bom}</span>
          <span>Qty: {order.quantity.toLocaleString()}</span>
        </div>
      )}

      {order.progress !== undefined && (
        <div className="mt-3">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">
              {order.progress}%
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-orange-100">
            <div
              className="h-full rounded-full bg-orange-500 transition-all"
              style={{ width: `${order.progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {order.assigneeInitials && (
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold text-white ${order.assigneeColor ?? 'bg-slate-400'}`}
            >
              {order.assigneeInitials}
            </div>
          )}
          {order.badge && (
            <span
              className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${order.badgeClass}`}
            >
              {order.badge}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {order.hasCheck && (
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          )}
          {order.hasWarning && (
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          )}
          {order.hasInfo && (
            <Info className="h-4 w-4 text-slate-400" />
          )}
          {order.timeRemaining && (
            <span className="flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
              <Clock className="h-3 w-3" />
              {order.timeRemaining}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}
