import { Search, ChevronDown, SlidersHorizontal } from 'lucide-react'
import type { StatusOption, DateRangeOption } from '@/types'

interface FilterBarProps {
  filterQuery: string
  onFilterChange: (value: string) => void
  statusFilter: string
  onStatusChange: (value: string) => void
  dateRange: string
  onDateRangeChange: (value: string) => void
  statusOptions: StatusOption[]
  dateRangeOptions: DateRangeOption[]
  onFilterSettingsClick: () => void
}

export default function FilterBar({
  filterQuery,
  onFilterChange,
  statusFilter,
  onStatusChange,
  dateRange,
  onDateRangeChange,
  statusOptions,
  dateRangeOptions,
  onFilterSettingsClick,
}: FilterBarProps) {
  return (
    <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={filterQuery}
          onChange={(e) => onFilterChange(e.target.value)}
          placeholder="Filter by Reference or Customer..."
          className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      <div className="relative">
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-9 text-sm text-slate-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>

      <div className="relative">
        <select
          value={dateRange}
          onChange={(e) => onDateRangeChange(e.target.value)}
          className="appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-9 text-sm text-slate-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        >
          {dateRangeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>

      <button
        type="button"
        onClick={onFilterSettingsClick}
        className="rounded-lg border border-slate-200 p-2 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
      >
        <SlidersHorizontal className="h-4 w-4" />
      </button>
    </div>
  )
}
