import { Calendar, Filter } from 'lucide-react'

interface FilterOptions {
  users: string[]
  modules: string[]
  actions: string[]
}

interface AuditLogsFilterBarProps {
  options: FilterOptions
}

export default function AuditLogsFilterBar({ options }: AuditLogsFilterBarProps) {
  return (
    <div className="mb-4 flex flex-wrap items-end gap-4 border-b border-slate-300 pb-4">
      {/* Date Range */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-slate-600">Date Range</label>
        <button className="flex h-9 items-center justify-between gap-2 rounded border border-slate-400 bg-white px-3 text-sm text-slate-700 min-w-[200px]">
          <span>01 May 2026 - 26 May 2026</span>
          <Calendar className="h-4 w-4 text-slate-500" />
        </button>
      </div>

      {/* User Dropdown */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-slate-600 text-center">User</label>
        <select className="h-9 rounded border border-slate-400 bg-white px-3 text-sm text-slate-700 min-w-[150px] appearance-none cursor-pointer">
          {options.users.map((user) => (
            <option key={user} value={user}>{user}</option>
          ))}
        </select>
      </div>

      {/* Module Dropdown */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-slate-600 text-center">Module</label>
        <select className="h-9 rounded border border-slate-400 bg-white px-3 text-sm text-slate-700 min-w-[150px] appearance-none cursor-pointer">
          {options.modules.map((mod) => (
            <option key={mod} value={mod}>{mod}</option>
          ))}
        </select>
      </div>

      {/* Actions Dropdown */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-slate-600 text-center">Actions</label>
        <select className="h-9 rounded border border-slate-400 bg-white px-3 text-sm text-slate-700 min-w-[150px] appearance-none cursor-pointer">
          {options.actions.map((act) => (
            <option key={act} value={act}>{act}</option>
          ))}
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex h-9 items-center gap-2">
        <button className="flex h-9 items-center gap-2 rounded border border-blue-400 bg-sky-200 px-4 text-sm font-medium text-slate-800 transition-colors hover:bg-sky-300">
          <Filter className="h-4 w-4" />
          Filter
        </button>
        <button className="flex h-9 items-center rounded border border-red-300 bg-red-200 px-4 text-sm font-medium text-slate-800 transition-colors hover:bg-red-300">
          Reset
        </button>
      </div>

      {/* Pagination Placeholder in Filter Bar (Matches Wireframe) */}
      <div className="ml-auto flex items-center gap-1 border border-slate-300 bg-white px-2 py-1 text-sm rounded">
        <button className="px-1.5 py-0.5 text-slate-500 hover:text-slate-900">&lt;</button>
        <button className="px-1.5 py-0.5 text-slate-900 border border-slate-300">1</button>
        <button className="px-1.5 py-0.5 text-slate-500 hover:text-slate-900">2</button>
        <button className="px-1.5 py-0.5 text-slate-500 hover:text-slate-900">3</button>
        <span className="px-1 text-slate-400">...</span>
        <button className="px-1.5 py-0.5 text-slate-500 hover:text-slate-900">100</button>
        <button className="px-1.5 py-0.5 text-slate-500 hover:text-slate-900">&gt;</button>
      </div>
    </div>
  )
}
