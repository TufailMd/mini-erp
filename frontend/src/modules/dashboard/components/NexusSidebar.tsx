import { Box } from 'lucide-react'
import type { NavSection, PageId } from '@/types'

interface NexusSidebarProps {
  sections: NavSection[]
  activePage: PageId
  onNavigate: (pageId: PageId) => void
}

export default function NexusSidebar({
  sections,
  activePage,
  onNavigate,
}: NexusSidebarProps) {
  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-64 flex-col border-r border-gray-100 bg-white">
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
          <Box className="h-5 w-5 text-white" />
        </div>
        <span className="text-lg font-bold text-gray-900">Nexus ERP</span>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-4">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
              {section.title}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon
                const isActive = activePage === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onNavigate(item.id)}
                    className={`relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {isActive && (
                      <span className="absolute -left-4 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r bg-blue-600" />
                    )}
                    <Icon
                      className={`h-4 w-4 shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-400'}`}
                    />
                    {item.label}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-gray-100 px-4 py-4">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
            AG
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Akash Gupta</p>
            <p className="text-xs text-gray-500">System Admin</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
