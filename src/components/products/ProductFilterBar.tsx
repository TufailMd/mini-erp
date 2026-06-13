import { X, Download, Printer, Filter } from 'lucide-react'
import type { ActiveFilter } from '../../types'

interface ProductFilterBarProps {
  filters: ActiveFilter[]
  onRemoveFilter: (filterId: string) => void
  onClearAll: () => void
  onExport: () => void
  onPrint: () => void
}

export default function ProductFilterBar({
  filters,
  onRemoveFilter,
  onClearAll,
  onExport,
  onPrint,
}: ProductFilterBarProps) {
  if (filters.length === 0) return null

  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {filters.map((filter) => (
          <div
            key={filter.id}
            className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs"
          >
            <Filter className="h-3 w-3 text-indigo-500" />
            <span className="text-slate-500">{filter.label}:</span>
            <span className="font-semibold text-slate-800">
              {filter.values.join(', ')}
            </span>
            <button
              type="button"
              onClick={() => onRemoveFilter(filter.id)}
              className="ml-0.5 rounded-full p-0.5 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={onClearAll}
          className="ml-2 text-xs font-medium text-indigo-600 transition-colors hover:text-indigo-700"
        >
          Clear all filters
        </button>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onExport}
          className="rounded-lg border border-slate-200 p-2 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
        >
          <Download className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onPrint}
          className="rounded-lg border border-slate-200 p-2 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
        >
          <Printer className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
