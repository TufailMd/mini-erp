import { Filter, Download } from 'lucide-react'

type FilterType = 'All' | 'Active' | 'Draft' | 'Archived'

interface BOMFilterBarProps {
  activeFilter: FilterType
  onFilterChange: (filter: FilterType) => void
  onExport: () => void
}

export default function BOMFilterBar({
  activeFilter,
  onFilterChange,
  onExport,
}: BOMFilterBarProps) {
  const tabs: FilterType[] = ['All', 'Active', 'Draft', 'Archived']

  return (
    <div className="mb-4 flex items-center justify-between rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
      <div className="flex space-x-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onFilterChange(tab)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeFilter === tab
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex items-center space-x-2">
        <button className="flex items-center space-x-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
          <Filter className="h-4 w-4 text-slate-400" />
          <span>Filter</span>
        </button>
        <button 
          onClick={onExport}
          className="flex items-center space-x-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          <Download className="h-4 w-4 text-slate-400" />
          <span>Export</span>
        </button>
      </div>
    </div>
  )
}
