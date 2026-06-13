import { Search, Bell, Clock, Zap, Plus } from 'lucide-react'

interface ProductsHeaderProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  onNewProductClick: () => void
  onButtonClick: () => void
}

export default function ProductsHeader({
  searchQuery,
  onSearchChange,
  onNewProductClick,
  onButtonClick,
}: ProductsHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div className="flex items-center gap-5">
        <h1 className="text-lg font-bold text-slate-900">Products</h1>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products, SKUs, or vendors..."
            className="w-72 rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* Live Sync Badge */}
        <button
          type="button"
          onClick={onButtonClick}
          className="flex items-center gap-2 rounded-full border border-green-300 bg-green-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-green-700 transition-colors hover:bg-green-100"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
          Live Sync
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onButtonClick}
          className="relative rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <button
          type="button"
          onClick={onButtonClick}
          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
        >
          <Clock className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={onNewProductClick}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          New Product
        </button>
      </div>
    </header>
  )
}
