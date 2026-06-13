import { Bell, Clock, Search } from 'lucide-react'

interface BOMListHeaderProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  onCreateBOM: () => void
  onButtonClick: () => void
}

export default function BOMListHeader({
  searchQuery,
  onSearchChange,
  onCreateBOM,
  onButtonClick,
}: BOMListHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Bill of Materials</h1>
        <p className="text-sm text-slate-500">Manage product templates and component structures</p>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search BOMs, products..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-10 w-64 rounded-xl border border-slate-200 pl-10 pr-4 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <button 
          onClick={onCreateBOM}
          className="h-10 rounded-xl bg-indigo-600 px-4 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          + Create New BOM
        </button>

        <div className="flex items-center space-x-3 border-l border-slate-200 pl-4">
          <button
            onClick={onButtonClick}
            className="relative rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          </button>
          <button
            onClick={onButtonClick}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <Clock className="h-5 w-5" />
          </button>
          <button
            onClick={onButtonClick}
            className="h-8 w-8 overflow-hidden rounded-full border border-slate-200"
          >
            <div className="flex h-full w-full items-center justify-center bg-indigo-100 text-sm font-medium text-indigo-700">
              MG
            </div>
          </button>
        </div>
      </div>
    </header>
  )
}
