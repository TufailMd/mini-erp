import { Menu, Search, Plus, UserCircle2 } from 'lucide-react'

interface AppNavbarProps {
  onToggleMenu: () => void
  onToggleProfile: () => void
  searchQuery: string
  onSearchChange: (val: string) => void
  onCreateNew: () => void
}

export default function AppNavbar({
  onToggleMenu,
  onToggleProfile,
  searchQuery,
  onSearchChange,
  onCreateNew
}: AppNavbarProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm">
      <div className="flex items-center gap-4 w-1/3">
        <button 
          onClick={onToggleMenu}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white">
            N
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 hidden sm:block">NexusERP</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 w-1/3">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search orders, bills of materials, products..."
            className="w-full rounded-lg border border-slate-300 bg-slate-50 py-2 pl-9 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
          />
        </div>
        <button
          onClick={onCreateNew}
          className="flex h-9 w-9 items-center justify-center shrink-0 rounded-lg bg-indigo-600 text-white transition-colors hover:bg-indigo-700 shadow-sm"
          title="Create New Order/BOM/Product"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <div className="flex items-center justify-end w-1/3">
        <button
          onClick={onToggleProfile}
          className="p-1 rounded-full text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <UserCircle2 className="h-8 w-8" />
        </button>
      </div>
    </header>
  )
}
