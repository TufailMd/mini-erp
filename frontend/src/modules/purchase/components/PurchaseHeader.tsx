import { Search, Bell, Clock } from 'lucide-react'

interface PurchaseHeaderProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  onButtonClick: () => void
}

export default function PurchaseHeader({
  searchQuery,
  onSearchChange,
  onButtonClick,
}: PurchaseHeaderProps) {
  const tabs = ['Overview', 'Vendors', 'Performance'] as const
  const activeTab = 'Vendors'

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-5">
          <h1 className="text-xl font-bold text-slate-900">Vendor Hub</h1>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search vendors, POs, Items..."
              className="w-72 rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
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

          <div className="ml-2 flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-800">Mahesh Gupta</p>
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                Purchase Manager
              </p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
              MG
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 px-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={onButtonClick}
            className={`relative pb-3 text-sm font-medium transition-colors ${
              tab === activeTab
                ? 'text-indigo-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab}
            {tab === activeTab && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-indigo-600" />
            )}
          </button>
        ))}
      </div>
    </header>
  )
}
