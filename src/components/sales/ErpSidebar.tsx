import { Plus, Box } from 'lucide-react'
import type { NavItem, PageId } from '../../types'

interface ErpSidebarProps {
  navItems: NavItem[]
  footerItems: NavItem[]
  activePage: PageId
  onNavigate: (pageId: PageId) => void
  onNewRecordClick: () => void
  userName?: string
  userRole?: string
  userInitials?: string
}

export default function ErpSidebar({
  navItems,
  footerItems,
  activePage,
  onNavigate,
  onNewRecordClick,
  userName,
  userRole,
  userInitials,
}: ErpSidebarProps) {
  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-60 flex-col border-r border-slate-200 bg-slate-50">
      <div className="border-b border-slate-200 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600">
            <Box className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">ERP Core</p>
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
              Enterprise Resource Planning
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        <button
          type="button"
          onClick={onNewRecordClick}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-700 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-800"
        >
          <Plus className="h-4 w-4" />
          New Record
        </button>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activePage === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {isActive && (
                <span className="absolute -left-3 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r bg-indigo-600" />
              )}
              <Icon
                className={`h-4 w-4 shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}
              />
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="space-y-0.5 border-t border-slate-200 px-3 py-4">
        {footerItems.map((item) => {
          const Icon = item.icon
          const isActive = activePage === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0 text-slate-400" />
              {item.label}
            </button>
          )
        })}
      </div>

      {userName && (
        <div className="border-t border-slate-200 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
              {userInitials ?? userName.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">{userName}</p>
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                {userRole ?? 'User'}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
