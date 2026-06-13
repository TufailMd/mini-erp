import { Plus, LayoutGrid, List } from 'lucide-react'
import type { ViewMode } from '../../types'

interface ManufacturingPageHeaderProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  onCreateClick: () => void
}

export default function ManufacturingPageHeader({
  viewMode,
  onViewModeChange,
  onCreateClick,
}: ManufacturingPageHeaderProps) {
  return (
    <div className="mb-6 flex items-start justify-between">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Manufacturing Orders</h2>
        <p className="mt-1 text-sm text-slate-500">
          Manage and track production across all work centers.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1">
          <button
            type="button"
            onClick={() => onViewModeChange('board')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              viewMode === 'board'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
            Board
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('list')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              viewMode === 'list'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <List className="h-4 w-4" />
            List
          </button>
        </div>

        <button
          type="button"
          onClick={onCreateClick}
          className="flex items-center gap-2 rounded-lg bg-indigo-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-800"
        >
          <Plus className="h-4 w-4" />
          Create MO
        </button>
      </div>
    </div>
  )
}
