import { Search, Bell, Clock, Zap, User } from 'lucide-react'
import type { HeaderTab } from '../../types'

interface ErpHeaderProps {
  activeTab: HeaderTab
  onTabChange: (tab: HeaderTab) => void
  searchQuery: string
  onSearchChange: (value: string) => void
  onButtonClick: () => void
  searchPlaceholder?: string
}

const tabs: { id: HeaderTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'reports', label: 'Reports' },
  { id: 'analytics', label: 'Analytics' },
]

export default function ErpHeader({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  onButtonClick,
  searchPlaceholder = 'Search...',
}: ErpHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div className="flex items-center gap-6">
        <h1 className="text-base font-bold text-slate-900 whitespace-nowrap">
          Enterprise
          <br />
          <span className="text-xs font-bold">ERP</span>
        </h1>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-52 rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* Tabs */}
        <nav className="flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`relative px-4 py-5 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-indigo-600'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
              )}
            </button>
          ))}
        </nav>
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
          onClick={onButtonClick}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          <Zap className="h-4 w-4" />
          Quick Action
        </button>

        <button
          type="button"
          onClick={onButtonClick}
          className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-slate-300 to-slate-400 transition-opacity hover:opacity-80"
        >
          <User className="h-5 w-5 text-white" />
        </button>
      </div>
    </header>
  )
}
