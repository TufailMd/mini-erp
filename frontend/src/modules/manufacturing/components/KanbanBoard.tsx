import type { KanbanColumnData } from '@/types'
import KanbanColumn from '@/modules/manufacturing/components/KanbanColumn'
import LoadingSpinner from '@/components/shared/LoadingSpinner'

interface KanbanBoardProps {
  columns: KanbanColumnData[]
  loading: boolean
  onAddClick: () => void
  onCardClick: (orderId: string) => void
  onMenuClick: () => void
}

export default function KanbanBoard({
  columns,
  loading,
  onAddClick,
  onCardClick,
  onMenuClick,
}: KanbanBoardProps) {
  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {columns.map((column) => (
        <KanbanColumn
          key={column.id}
          column={column}
          onAddClick={onAddClick}
          onCardClick={onCardClick}
          onMenuClick={onMenuClick}
        />
      ))}
    </div>
  )
}
