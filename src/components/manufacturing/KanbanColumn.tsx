import { Plus, MoreHorizontal, Circle } from 'lucide-react'
import type { KanbanColumnData } from '../../types'
import KanbanCard from './KanbanCard'

interface KanbanColumnProps {
  column: KanbanColumnData
  onAddClick: () => void
  onCardClick: (orderId: string) => void
  onMenuClick: () => void
}

export default function KanbanColumn({
  column,
  onAddClick,
  onCardClick,
  onMenuClick,
}: KanbanColumnProps) {
  const isInProgress = column.id === 'in-progress'

  return (
    <div
      className={`flex flex-col rounded-xl border border-slate-200 bg-slate-50/50 ${column.columnBorder ?? ''}`}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Circle className={`h-2.5 w-2.5 fill-current ${column.iconColor}`} />
          <span className="text-sm font-semibold text-slate-800">
            {column.title}
          </span>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${column.countBadgeClass}`}
          >
            {column.orders.length}
          </span>
        </div>

        {isInProgress ? (
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onAddClick}
            className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600"
          >
            <Plus className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 px-3 pb-3">
        {column.orders.map((order) => (
          <KanbanCard
            key={order.id}
            order={order}
            onClick={() => onCardClick(order.id)}
          />
        ))}
      </div>
    </div>
  )
}
